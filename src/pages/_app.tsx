import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import { Header } from '../../components/header'
import { Player } from '../../components/player'
import { PlayerContext } from '../contextos/player.contexto'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setPlaying] = useState(false)

  function play(episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setPlaying(true)
  }

  function togglePay(){
    setPlaying(!isPlaying)
  }

  return (

    <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, play, isPlaying, togglePay}}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
