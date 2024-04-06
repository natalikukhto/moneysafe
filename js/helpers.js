export const convertStringNumber = (str) => {
    const noSpaceStr = String(str).replace(/\s+/g, '');
    const num = parseFloat(noSpaceStr);

    if (!isNaN(num) && isFinite(num)) {
        return num;
    } else {
        return false;
    }

};

export const reformatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
}

export const animationNumber = (element, number) => {
    const fps = 60;
    const duration = 1000;
    const fraimeDuration = duration / fps;
    const totalFraime = Math.round(duration / fraimeDuration);

    let currentFraime = 0;

    const initialNumber = parseInt(element.textContent.replace(/[^0-9.-]+/g, ''));

    const increment = Math.trunc((number - initialNumber / totalFraime));


    const animate = () => {

        currentFraime += 1;

        const newNumber = initialNumber + increment * currentFraime;

        element.textContent = `${newNumber.toLocaleString("Ru-ru")} ₽`;
        if (currentFraime < totalFraime) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = `${number.toLocaleString("Ru-ru")} ₽`;
        }
    }
    requestAnimationFrame(animate);
}

//animation number no goode
/*export const animationNumber = (element, number) => {
    const fps = 60;
    const duration = 1000;
    const fraimeDuration = duration / fps;
    const totalFraime = Math.round(duration / fraimeDuration);

    let currentFraime = 0;

    const initialNumber = parseInt(element.textContent.replace(/[^0-9.-]+/g, ''));

    const increment = Math.trunc((number - initialNumber / totalFraime));

    const intervalId = setInterval(() => {
        currentFraime += 1;

        const newNumber = initialNumber + increment * currentFraime;

        element.textContent = `${newNumber.toLocaleString("Ru-ru")} ₽`;
        if (currentFraime === totalFraime) {
            clearInterval(intervalId);
            element.textContent = `${number.toLocaleString("Ru-ru")} ₽`;
        }
    }, fraimeDuration);
} */