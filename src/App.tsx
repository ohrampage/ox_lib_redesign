import { isEnvBroswer } from './utils'

function App() {
  return (
    <div className={`w-full h-screen grid place-items-center ${isEnvBroswer() ? 'bg-[url(https://i.imgur.com/3pzRj9n.png)]' : ''}`}
    // style={{ 
    //   backgroundImage: isEnvBroswer() ? `url(https://i.imgur.com/3pzRj9n.png)` : 'none',
    // }}
    >
      <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>Hello, fivem!</h2>
    </div>
  )
}

export default App
