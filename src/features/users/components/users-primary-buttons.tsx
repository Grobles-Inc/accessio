import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useUsersContext } from '../context/users-context-new'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsersContext()
  return (
    <div className='flex gap-2'>
      {/* <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>Invite User</span> <IconMailPlus size={18} />
      </Button> */}
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Añadir Usuario</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
