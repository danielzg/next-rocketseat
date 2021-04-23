import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link'
import Image from 'next/image'
import { convertDurationToTimeString } from '../../../utils/convertDurationsToTimeString';
import style from './episode.module.scss'

type Episode = {
    id: string,
    title: string,
    members: string,
    publishedAt: string,
    duration: number,
    thumbnail: string,
    durationAsString: string,
    url: string,
    description: string
  }

type EpisodeProps = {
    episode: Episode
}  

export default function Episode({episode}: EpisodeProps){
    const router = useRouter()

    if(router.isFallback){
        return <p>Carregando</p>
    }

    return (
        <div className={style.episode}>
            <div className={style.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image width={700} height={160}
                src={episode.thumbnail} objectFit="cover"/>
                <button type="button">
                    <img src="/play.svg" alt="Tocar Episodio" />
                </button>
            </div>
            
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={style.description}>
                {episode.description}
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {

    const { data } = await api.get(`episodes`, {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params:{
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (contexto) => {
    const {slug} = contexto.params;

    const { data } = await api.get(`episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }), 
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        file: data.file.url
    }
    
    return {
        props:{
            episode
        },
        revalidate: 60 * 20
    }
}