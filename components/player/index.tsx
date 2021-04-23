
import { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PlayerContext } from '../../src/contextos/player.contexto'
import Slyder from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './style.module.scss'

export function Player(){

    const audioRef = useRef<HTMLAudioElement>(null)
   
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePay 
    } = useContext(PlayerContext)

    useEffect( ()=>{
                    if(!audioRef.current){
                        return;
                    }

                    if(isPlaying){
                        audioRef.current.play()
                    } else{
                        audioRef.current.pause()
                    }
                }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer }>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} 
                    objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                       {episode ? (
                           <Slyder
                           trackStyle={{backgroundColor: '#04d561'}}
                           railStyle={{backgroundColor: '#9f75ff'}}
                           />
                       ) : (
                            <div className={styles.emptySlider} />
                       )}
                    </div>
                        <span>00:00</span>
                </div>
                {episode && (
                    <audio src={episode.file} autoPlay ref={audioRef} />
                )}

                <div className={styles.button}>
                    <button type="button">
                        <img src="/shuffle.svg" alt="embaralhar"/>
                    </button>
                    <button type="button">
                        <img src="/play-previous.svg" alt="tocar anterior"/>
                    </button>
                    <button type="button" onClick={togglePay} className={styles.playButton}>
                        {isPlaying
                        ? <img src="/pause.svg" alt="Pausar"/>
                        : <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" >
                        <img src="/play-next.svg" alt="Tocar Proxima"/>
                    </button>
                    <button type="button" className={styles.playButton}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}