import './css/App.css'
import './components/tagsInput'
import { TagsInput } from './components/tagsInput'
import { SceneView } from './components/sceneView'


function App() {
  return (
    <div className="main-container">
      <div> Display </div>
      <div className='main-controls'>
        <SceneView/>
      </div>
    </div>
  )
}

export default App
