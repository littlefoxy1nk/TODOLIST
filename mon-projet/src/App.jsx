import { useState } from 'react'
import './App.css'
import NavBar from './component/navBar'
import Footer from './component/footer'
import TodoList from './component/TodoList'

function App() {

  return (
    <>
    <NavBar />
    <TodoList />
    <Footer />
    </>
  )
}

export default App
