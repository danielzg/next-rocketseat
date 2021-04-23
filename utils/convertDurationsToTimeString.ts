export function convertDurationToTimeString(duration: number){
    const hours = Math.floor(duration / (60*60));
    const minutes = Math.floor( (duration % (60*60)) / 60);
    const segundos = duration % 60;

    const finaleResult = [hours, minutes, segundos].map(valor => {
        return String(valor).padStart(2, '0')
    }).join(':')

    return finaleResult;
}