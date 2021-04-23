import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Head from 'next/head'
import { useContext, useEffect } from 'react';
import Link from 'next/link'
import { convertDurationToTimeString } from '../../utils/convertDurationsToTimeString';
import { api } from '../services/api';
import styles from './home.module.scss'
import Image from 'next/image'
import { PlayerContext } from '../contextos/player.contexto';

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  duration: number,
  thumbnail: string,
  durationAsString: string,
  file: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
console.log(latestEpisodes)
  //SPA
  // useEffect( () => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [] )

  //console.log(props.episodes)

  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map( episode => {
            return (
              <li key={episode.id}>
                <img
                src={episode.thumbnail} alt={episode.title}/>

                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar Episodio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos os Episódios</h2>

          <table cellSpacing="0">
            <thead>
              <tr>
                <th></th>
                <th>Poscast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map( episodio => {
                return (
                  <tr key={episodio.id}>
                      <td style={{width: 80 }}>
                        <Image width={120} height={120} src={episodio.thumbnail}
                        alt={episodio.title}
                        objectFit="cover"/>
                      </td>
                      <td>
                      <Link href={`/episode/${episodio.id}`}>
                        <a >{episodio.title}</a>
                        </Link>
                      </td>
                      <td>{episodio.members}</td>
                      <td style={{width: 100 }}>{episodio.publishedAt}</td>
                      <td>{episodio.durationAsString}</td>
                      <td>
                        <button type="button" onClick={() => play(episodio)}>
                          <img src="/play-green.svg" alt="Tocar Episodio" />
                        </button>
                      </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>

    </div>
  );
}

//SSR
//export async function getServerSideProps(){

//SSG
export const getStaticProps: GetStaticProps = async () => {  
    const {data} = await api.get('episodes', {
      params:{
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
      }
    })
    
    const episodes = data.map(episode => { //fazer qq transformação antes de renderizar 
      return {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }), 
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        description: episode.description,
        file: episode.file.url
      }
    })

    const latestEpisodes = episodes.slice(0,2)
    const allEpisodes = episodes.slice(2, episodes.length)

    return {
      props: {
        latestEpisodes,
        allEpisodes
      },
      revalidate: 60 * 60 * 8 //8hrs
    }
}
