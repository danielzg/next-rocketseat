// import format from 'date-fns/format';
// import ptBR from 'date-fns/locale/pt-BR';

import styles from './style.module.scss'

export function Header(){

    //const currentDate = format(new Date(), 'EEEEEE d MMMM')
    const currentDate = new Date().toLocaleDateString()

    return (
        <header className={styles.headerContainer}>
            <img src='/logo.svg'/>

            <p>
                O Melhor para você ouvir sempre
            </p>
            <span>{currentDate}</span>
        </header>
    )
}