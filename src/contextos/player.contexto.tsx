import { createContext, ReactNode, useState } from "react";

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    file: string
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    play: (episode: Episode) => void,
    isPlaying: boolean,
    togglePay: () => void,
    playList: (list: Episode[], indice: number) => void
}

type PlayerContentProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children} : PlayerContentProviderProps){

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setPlaying] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setPlaying(true)
  }

  function togglePay(){
    setPlaying(!isPlaying)
  }

  function playList(list: Episode[], indice: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(indice)
    setPlaying(true)
  }

  return (

    <PlayerContext.Provider 
        value={{
          episodeList, 
          currentEpisodeIndex, 
          play, 
          isPlaying, 
          togglePay,
          playList
          }}>
            
        {children}
    </PlayerContext.Provider>

  )
}