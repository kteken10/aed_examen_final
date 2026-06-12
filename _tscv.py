# -*- coding: utf-8 -*-
import warnings; warnings.filterwarnings('ignore')
import numpy as np, pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

sig=pd.read_excel('02_signaux_marche.xlsx')
sig['date']=pd.PeriodIndex(sig['month'],freq='M').to_timestamp()
sig=sig.sort_values(['country','date']).reset_index(drop=True)
countries=sorted(sig.country.unique())

def feat(df):
    s=df.copy(); s['moy']=s.date.dt.month; s['t']=(s.date.dt.year-2022)*12+(s.date.dt.month-1)
    s['sin']=np.sin(2*np.pi*s.moy/12); s['cos']=np.cos(2*np.pi*s.moy/12)
    s['lag1']=s.groupby('country')['demand_index'].shift(1); s['lag12']=s.groupby('country')['demand_index'].shift(12)
    for c in countries: s[f'c_{c}']=(s.country==c).astype(int)
    return s
S=feat(sig); FEATS=['t','sin','cos','lag1','lag12']+[f'c_{c}' for c in countries]
def fourier(idx,K=2): return np.column_stack([f(2*np.pi*k*idx/12) for k in range(1,K+1) for f in (np.sin,np.cos)])
def sarima(tr,h,ex_tr=None,ex_te=None):
    lo,hi=tr.min()*0.5,tr.max()*1.5
    for o,so in [((1,1,1),(1,1,0,12)),((1,1,1),(0,1,1,12)),((1,1,1),(0,0,0,12)),((0,1,1),(0,0,0,12))]:
        try:
            m=SARIMAX(tr,order=o,seasonal_order=so,exog=ex_tr,enforce_stationarity=True,enforce_invertibility=True).fit(disp=False,maxiter=150)
            f=np.asarray(m.get_forecast(steps=h,exog=ex_te).predicted_mean)
            if np.all(np.isfinite(f)) and f.min()>=lo and f.max()<=hi: return f
        except Exception: continue
    return None

METHODS=['Naive','SaisNaive','Metier','SARIMA','SARIMAX','LinReg','RF']
def forecast_all(cutoff,h):
    """retourne {methode: MAE moyen sur les 8 pays} pour un pli (train<cutoff, test=h mois)."""
    trg=S[S.date<cutoff].dropna(subset=['lag1','lag12'])
    lin=LinearRegression().fit(trg[FEATS],trg.demand_index)
    rf=RandomForestRegressor(n_estimators=200,max_depth=6,random_state=0).fit(trg[FEATS],trg.demand_index)
    per={m:[] for m in METHODS}
    for c in countries:
        d=sig[sig.country==c].set_index('date')['demand_index']
        tr=d[d.index<cutoff]; te=d[(d.index>=cutoff)][:h]
        if len(te)<h or len(tr)<24: return None
        y=te.values; pr={}
        pr['Naive']=np.repeat(tr.iloc[-1],h)
        pr['SaisNaive']=np.array([d.get(t-pd.DateOffset(years=1),tr.iloc[-1]) for t in te.index])
        pr['Metier']=np.array([tr[tr.index.month==t.month].mean() for t in te.index])
        itr=np.arange(len(tr)); ite=np.arange(len(tr),len(tr)+h)
        sa=sarima(tr.values,h); sx=sarima(tr.values,h,fourier(itr),fourier(ite))
        pr['SARIMA']=sa if sa is not None else pr['SaisNaive']; pr['SARIMAX']=sx if sx is not None else pr['SaisNaive']
        for nm,mdl in [('LinReg',lin),('RF',rf)]:
            hist=d[d.index<cutoff].to_dict(); out=[]
            for t in te.index:
                row={'t':(t.year-2022)*12+(t.month-1),'sin':np.sin(2*np.pi*t.month/12),'cos':np.cos(2*np.pi*t.month/12),
                     'lag1':hist[max(hist)],'lag12':d.get(t-pd.DateOffset(years=1),tr.iloc[-1])}
                for cc in countries: row[f'c_{cc}']=int(cc==c)
                v=float(mdl.predict(pd.DataFrame([row])[FEATS])[0]); hist[t]=v; out.append(v)
            pr[nm]=np.array(out)
        for m in METHODS: per[m].append(mean_absolute_error(y,pr[m]))
    return {m:np.mean(per[m]) for m in per}

# ===== TIME SERIES CROSS-VALIDATION (rolling origin, expanding window, horizon=1) =====
print('=== TSCV — expanding window, 12 plis (origines mensuelles 2024), horizon 1 ===')
folds=pd.date_range('2024-01-01','2024-12-01',freq='MS')
res={m:[] for m in METHODS}
for cut in folds:
    r=forecast_all(cut,1)
    if r:
        for m in METHODS: res[m].append(r[m])
tab=pd.DataFrame({m:[np.mean(res[m]),np.std(res[m])] for m in METHODS},index=['MAE_moyen','MAE_std']).T
print(tab.round(2).sort_values('MAE_moyen').to_string())

# ===== 3-WAY TEMPORAL SPLIT =====
print('\n=== 3-WAY SPLIT : train<=2023-12 | VALIDATION 2024 H1 | TEST 2024 H2 (horizon 6) ===')
val=forecast_all(pd.Timestamp('2024-01-01'),6)
test=forecast_all(pd.Timestamp('2024-07-01'),6)
comp=pd.DataFrame({'VALIDATION (2024 H1)':val,'TEST (2024 H2)':test}).round(2).sort_values('VALIDATION (2024 H1)')
print(comp.to_string())
best_val=comp['VALIDATION (2024 H1)'].idxmin()
print(f'\n=> Modele choisi SUR LA VALIDATION : {best_val}')
print(f'=> Sa performance sur le TEST (jamais vu pour la selection) : MAE {comp.loc[best_val,"TEST (2024 H2)"]}')
