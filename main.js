let blocks = document.querySelectorAll('.block'),
    isDead = false;
const quantity = 255;//Количество блоков на карте
let flagCounter = 40;
var refreshIntervalId;
document.querySelector('.smile').addEventListener('click', ()=>{
    document.querySelector('.smileImg').setAttribute('src', '/icons/smile.png');
    blocks.forEach(block => {
        block.className = 'block not-active';
    });
    refreshTimer();
    flagCounter = 40;
    document.querySelector('.couner_2').setAttribute('src', '/icons/timer_4.png');
    document.querySelector('.couner_3').setAttribute('src', '/icons/timer_0.png');
});
blocks.forEach(block => {
    block.addEventListener('mousedown', (e)=>{
        if(e.button == 0){
            document.querySelector('.smileImg').setAttribute('src', '/icons/scared.png');
        }
    });
    block.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        const target = e.target;
        console.log(target);
        const isLeftClick = e.button === 0;
        const hasFlagClass = target.classList.contains('flag');
        const hasQuestionClass = target.classList.contains('question');
        if (!isLeftClick || hasFlagClass || hasQuestionClass) {
            return;
        }
        const inviseBombs = document.querySelectorAll('.invise-bomb');
        if (inviseBombs.length === 0) {
            document.querySelector('.smileImg').setAttribute('src', '/icons/smile.png');
            firstPoint(block);
            timer();
            return;
        }
        if (isDead) {
            return;
        }
        if (block.classList.contains('invise-bomb')) {
            dead(block);
            return;
        }
        document.querySelector('.smileImg').setAttribute('src', '/icons/smile.png');
        openBlocks(block);
    });
    block.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (e.button !== 2 || flagCounter < 1) return;
        if(block.classList.contains('flag')){
            block.classList.add('question');
            block.classList.remove('flag');
            ++flagCounter;
        } else if(block.classList.contains('question')){
            block.classList.remove('flag');
            block.classList.remove('question');
        } else {
            block.classList.add('flag');
            block.classList.remove('question');
            --flagCounter;
        }
        let units = flagCounter % 10;
        let tens = Math.floor(flagCounter / 10 % 10);
        document.querySelector('.couner_2').setAttribute('src', '/icons/timer_'+tens+'.png');
        document.querySelector('.couner_3').setAttribute('src', '/icons/timer_'+units+'.png');
    });
});

const dead = (block)=>{
    isDead = true;
    document.querySelector('.smileImg').setAttribute('src', '/icons/dead.png');
    blocks.forEach(element => {
        if(element.classList.contains('flag') && !element.classList.contains('invise-bomb')){
            element.classList.add('fake-mine')
        }
        if(element.classList.contains('invise-bomb')){
            if(!element.classList.contains('flag')){
                element.classList.add('mine')
            }
        }
        element.classList.add('dead');
    });
    block.classList.remove('not-active');
    block.classList.add('bomb');
    clearInterval(refreshIntervalId);
}
const randomBomb = (blockIsClicked)=>{
    randomNumber = randomIntFromInterval(0, quantity);
    if(!blocks[randomNumber].classList.contains('invise-bomb') && blocks[randomNumber]!=blockIsClicked){
        blocks[randomNumber].classList.remove('not-active');
        blocks[randomNumber].classList.add('invise-bomb');
    } else {
        randomBomb();
    }
}
const firstPoint = (block)=>{
    let i = 0;
    while(i < 40){
        randomBomb(block);
        i++;
    }
    firstClick = false;
    openFreeBlocks(block);
}
const openBlocks = (block)=>{
    const lines = document.querySelectorAll('.block-line');
    let blockNumber, lineNumber;
    for (let i = 0; i < lines.length; i++) {
        const lineBlocks = lines[i].querySelectorAll('.block');
        for (let j = 0; j < lineBlocks.length; j++) {
            if (lineBlocks[j] === block) {
                blockNumber = j;
                lineNumber = i;
                break;
            }
        }
        if (typeof lineNumber !== 'undefined') {
            break;
        }
    }
    rightDown(lineNumber, blockNumber);
    rightUp(lineNumber, blockNumber);
    leftDown(lineNumber, blockNumber);
    leftUp(lineNumber, blockNumber);
    function rightUp(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber > 0) {
            if(lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                ++newBlockNumber;
            }            
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber < 16 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                if(timeBlockNumber < 14){
                    checkedBomb(lines, lineNumber, timeBlockNumber+1);
                    if(lines[lineNumber].querySelectorAll('.block')[timeBlockNumber+1].matches('.question, .flag, .one-bomb, .two-bomb, .three-bomb, .four-bomb, .five-bomb, .six-bomb, .seven-bomb, .eight-bomb')) {  
                        break;
                    }
                }
                timeBlockNumber++;
            }
            try {
                if(lineNumber > 0){
                    checkedBomb(lines, lineNumber-1, timeBlockNumber);
                    if(!lines[lineNumber-1].querySelectorAll('.block')[timeBlockNumber].contains('.active')) {  
                        break;
                    }
                }
            } catch (error) {break;}
           
            lineNumber--;
        }
    }
    function rightDown(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber < 16) {
            if(lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                ++newBlockNumber;
            }            
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber < 15 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                if(timeBlockNumber < 14){
                    checkedBomb(lines, lineNumber, timeBlockNumber+1);
                    if(lines[lineNumber].querySelectorAll('.block')[timeBlockNumber+1].matches('.question, .flag, .one-bomb, .two-bomb, .three-bomb, .four-bomb, .five-bomb, .six-bomb, .seven-bomb, .eight-bomb')) {  
                        break;
                    }
                }
                timeBlockNumber++;
            }
            try {
                if(lineNumber < 14){
                    checkedBomb(lines, lineNumber+1, timeBlockNumber);
                    if(!lines[lineNumber+1].querySelectorAll('.block')[timeBlockNumber].contains('.active')) {  
                        break;
                    }
                }
            } catch (error) {break;}
            
            lineNumber++;
        }
    }   
    function leftUp(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber > 0) {
            if(lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                ++newBlockNumber;
            }            
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber > 0 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                if(timeBlockNumber > 0){
                    checkedBomb(lines, lineNumber, timeBlockNumber-1);
                    if(lines[lineNumber].querySelectorAll('.block')[timeBlockNumber-1].matches('.question, .flag, .one-bomb, .two-bomb, .three-bomb, .four-bomb, .five-bomb, .six-bomb, .seven-bomb, .eight-bomb')) {  
                        break;
                    }
                }
                timeBlockNumber--;
            }
            try {
                if(lineNumber > 0){
                    checkedBomb(lines, lineNumber-1, timeBlockNumber);
                    if(!lines[lineNumber-1].querySelectorAll('.block')[timeBlockNumber].contains('.active')) {  
                        break;
                    }
                }
            } catch (error) {break;}
            lineNumber--;
        }
    }
    function leftDown(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber < 15) {
            if(lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                ++newBlockNumber;
            }            
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber > 0 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                if(timeBlockNumber > 0){
                    checkedBomb(lines, lineNumber, timeBlockNumber-1);
                    if(lines[lineNumber].querySelectorAll('.block')[timeBlockNumber-1].matches('.question, .flag, .one-bomb, .two-bomb, .three-bomb, .four-bomb, .five-bomb, .six-bomb, .seven-bomb, .eight-bomb')) {  
                        break;
                    }
                }
                timeBlockNumber--;
            }
            try {
                if(lineNumber < 14){
                    checkedBomb(lines, lineNumber+1, timeBlockNumber);
                    if(!lines[lineNumber+1].querySelectorAll('.block')[timeBlockNumber].contains('.active')) {  
                        break;
                    }
                }
            } catch (error) {break}
            
            lineNumber++;
        }
    }
    checkWin();
}
const openFreeBlocks = (block) => {
    const lines = document.querySelectorAll('.block-line');
    let blockNumber, lineNumber;
    for (let i = 0; i < lines.length; i++) {
        const lineBlocks = lines[i].querySelectorAll('.block');
        for (let j = 0; j < lineBlocks.length; j++) {
            if (lineBlocks[j] === block) {
                blockNumber = j;
                lineNumber = i;
                break;
            }
        }
        if (typeof lineNumber !== 'undefined') {
            break;
        }
    }
    rightDown(lineNumber, blockNumber);
    rightUp(lineNumber, blockNumber);
    leftDown(lineNumber, blockNumber);
    leftUp(lineNumber, blockNumber);
    function rightUp(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber > 0) {
            while (lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                newBlockNumber++;
            }
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber < 15 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                timeBlockNumber++;
            }
            lineNumber--;
        }
    }
    function rightDown(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber < 15) {
            while (lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                newBlockNumber++;
            }
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber < 15 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                timeBlockNumber++;
            }
            lineNumber++;
        }
    }
    function leftUp(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber > 0) {
            while (lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                newBlockNumber--;
            }
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber > 0 &&!lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                timeBlockNumber--;
            }
            lineNumber--;
        }
    }
    function leftDown(lineNumber, blockNumber) {
        let newBlockNumber = blockNumber;
        while (lineNumber < 16) {
            while (lines[lineNumber].querySelectorAll('.block')[newBlockNumber].classList.contains('invise-bomb')) {
                newBlockNumber--;
            }
            let timeBlockNumber = newBlockNumber;
            while (timeBlockNumber > 0 && !lines[lineNumber].querySelectorAll('.block')[timeBlockNumber].classList.contains('invise-bomb')) {
                checkedBomb(lines, lineNumber, timeBlockNumber);
                timeBlockNumber--;
            }
            lineNumber++;
        }
    }
};
const checkWin = () =>{
    let notActiveBlocks = document.querySelectorAll('.not-active').length;
    console.log(`Осталось: ${notActiveBlocks} блоков`)
    if(notActiveBlocks == 0){
        document.querySelector('.smileImg').setAttribute('src', '/icons/smile-win.png');
        console.log('Вы победили!')
        clearInterval(refreshIntervalId);
    }
}
const checkedBomb = (lines, lineNumber, timeBlockNumber) => {
    if(lineNumber == 16) lineNumber=15;
    if(timeBlockNumber == 16) timeBlockNumber=15;
    const block = lines[lineNumber].querySelectorAll('.block')[timeBlockNumber];
    if(!block.classList.contains('flag') && !block.classList.contains('invise-bomb')){
        const neighbors = [lines[lineNumber]?.querySelectorAll('.block')[timeBlockNumber-1],
        lines[lineNumber-1]?.querySelectorAll('.block')[timeBlockNumber-1],
        lines[lineNumber-1]?.querySelectorAll('.block')[timeBlockNumber],
        lines[lineNumber-1]?.querySelectorAll('.block')[timeBlockNumber+1],
        lines[lineNumber]?.querySelectorAll('.block')[timeBlockNumber+1],
        lines[lineNumber+1]?.querySelectorAll('.block')[timeBlockNumber+1],
        lines[lineNumber+1]?.querySelectorAll('.block')[timeBlockNumber],
        lines[lineNumber+1]?.querySelectorAll('.block')[timeBlockNumber-1],
        ];
        const checkBomb = neighbors.filter(n => n?.classList.contains('invise-bomb')).length;
        const classMap = {
        1: 'one-bomb',
        2: 'two-bomb',
        3: 'three-bomb',
        4: 'four-bomb',
        5: 'five-bomb',
        6: 'six-bomb',
        7: 'seven-bomb',
        8: 'eight-bomb',
        };
        block.classList.add(classMap[checkBomb] || 'active');
        block.classList.remove('not-active');
    }
};
const randomIntFromInterval = (min, max)=> { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
const timer = ()=>{
    let time = 0;
    refreshIntervalId = setInterval(() => {
        ++time;
        let units = time % 10;
        let tens = Math.floor(time / 10 % 10);
        let hundreds = Math.floor(time / 100 % 10);
        document.querySelector('.timer_1').setAttribute('src', '/icons/timer_'+hundreds+'.png');
        document.querySelector('.timer_2').setAttribute('src', '/icons/timer_'+tens+'.png');
        document.querySelector('.timer_3').setAttribute('src', '/icons/timer_'+units+'.png');
    }, 1000);
}
const refreshTimer = ()=>{
    clearInterval(refreshIntervalId);
    document.querySelector('.timer_1').setAttribute('src', '/icons/timer_0.png');
    document.querySelector('.timer_2').setAttribute('src', '/icons/timer_0.png');
    document.querySelector('.timer_3').setAttribute('src', '/icons/timer_0.png');
}