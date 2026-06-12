import { useState } from 'react'
import { LayoutDashboard, Database, BookText, ShieldAlert, ScrollText, Images, Code2 } from 'lucide-react'
import data from './data.json'
import { DashboardLayout } from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Dictionary from './pages/Dictionary'
import GoldData from './pages/GoldData'
import QualityLog from './pages/QualityLog'
import Report from './pages/Report'
import Annexes from './pages/Annexes'
import References from './pages/References'

const SECTIONS = [
  { label: "Vue d'ensemble", items: [{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, C: Dashboard }] },
  { label: 'Données & qualité', items: [
    { id: 'gold', label: 'Data Gold', icon: Database, C: GoldData },
    { id: 'dico', label: 'Dictionnaire', icon: BookText, C: Dictionary },
    { id: 'qual', label: 'Journal qualité', icon: ShieldAlert, C: QualityLog },
  ] },
  { label: 'Restitution', items: [
    { id: 'rep', label: 'Rapport final', icon: ScrollText, C: Report },
    { id: 'annx', label: 'Annexes', icon: Images, C: Annexes },
    { id: 'ref', label: 'Références', icon: Code2, C: References },
  ] },
]

export default function App() {
  const [active, setActive] = useState('dash')
  const Active = SECTIONS.flatMap(s => s.items).find(i => i.id === active).C
  return (
    <DashboardLayout sections={SECTIONS} active={active} onSelect={setActive} stats={data.stats}>
      <Active data={data} />
    </DashboardLayout>
  )
}
