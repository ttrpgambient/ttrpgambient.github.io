import './css/App.css'
import './components/tagsInput'
import { TagsInput } from './components/tagsInput'


function App() {
  return (
    <div className="App">
      <h2>Enter Some Tags ...</h2>
      <TagsInput/>
    </div>
  )
}

export default App
