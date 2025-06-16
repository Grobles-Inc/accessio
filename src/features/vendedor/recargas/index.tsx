import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { RecargasDialogs } from './components/recargas-dialogs'
import { RecargasPrimaryButtons } from './components/recargas-primary-buttons'
import RecargasProvider from './context/recargas-context'
import { recargas } from './data/recargas'
import { recargaSchema } from './data/schema'

export default function Recargas() {

  const recargasList = recargas.map(recarga => recargaSchema.parse(recarga))
  return (
    <RecargasProvider>
      <Header fixed>
        <Search />
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Recargas</h2>
            <p className='text-muted-foreground'>
              Aquí puedes ver la lista de tus recargas.
            </p>
          </div>
          <RecargasPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={recargasList} columns={columns} />
        </div>
      </Main>
      <RecargasDialogs />
    </RecargasProvider>
  )
}
