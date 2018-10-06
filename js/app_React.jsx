import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener("DOMContentLoaded", function(){

    let maxWidth = Math.floor(window.innerWidth/10) - 20;
    let maxHeight = Math.floor(window.innerHeight/10) - 20;

    class GameBoard extends React.Component{
        constructor(props){
            super(props);
        }

        handleMouseOver = (e) => {
            if (e.target.className.indexOf("live") == -1) {
                e.target.classList.add("live");
            } else {
                e.target.classList.remove("live");
            }
        }

        render(){
            let boardWidthStyle = String(this.props.width * 10) + "px";
            let boardHeightStyle = String(this.props.height * 10) + "px";
            const styleBoard = {width: boardWidthStyle, height:boardHeightStyle};
            const numberOfElements = this.props.width * this.props.height;
            const cells = Array(numberOfElements).fill().map((el, index) => {
                return <div key={index} onMouseOver={this.handleMouseOver}></div>
            });
            return(
                <section style={styleBoard} id="board">
                    {cells}
                </section>
            )
        }
    }

    class GameMenu extends React.Component{
        constructor(props){
            super(props);
        }

        handlePlayClick = (e) => {
            this.props.play(e);
        }

        handlePauseClick = (e) => {
            this.props.pause(e);
        }

        handleResetClick = (e) => {
            this.props.reset(e);
        }

        render(){
            return(
                <section id="game-menu">
                    <button id="play" onClick={this.handlePlayClick}>Play</button>
                    <button id="pause" onClick={this.handlePauseClick}>Pause</button>
                    <button id="reset" onClick={this.handleResetClick}>Reset the game</button>
                </section>
            )
        }

    }

    class Game extends React.Component{
        constructor(props){
            super(props);
        }

        createCellArray = () => {
            this.cells = document.querySelectorAll('#board div');
        }

        cellIndex = (x, y) => {
            let indexNumber = x + y*this.props.width;
            return this.cells[indexNumber];
        }

        setCellState = (x, y, state) => {
            if (this.cellIndex(x,y).className.indexOf(state) == -1) {
                this.cellIndex(x,y).classList.toggle(state);
            }
        }

        computeCellNextState = (x,y) => {
            const neighbourArray =[];
            if ( (x != 0) && (y != 0) ) {
                neighbourArray.push(this.cellIndex(x-1, y-1));
            }
            if (y != 0) {
                neighbourArray.push(this.cellIndex(x, y-1));
            }
            if ((x != this.props.width-1) && (y != 0)) {
                neighbourArray.push(this.cellIndex(x+1, y-1));
            }
            if (x != 0) {
                neighbourArray.push(this.cellIndex(x-1, y));
            }
            if (x != this.props.width-1) {
                neighbourArray.push(this.cellIndex(x+1, y));
            }
            if ((x != 0) && (y != this.props.height-1)) {
                neighbourArray.push(this.cellIndex(x-1, y+1));
            }
            if (y != this.props.height-1) {
                neighbourArray.push(this.cellIndex(x, y+1));
            }
            if ((x != this.props.width-1) && (y != this.props.height-1)) {
                neighbourArray.push(this.cellIndex(x+1, y+1));
            }

            let counter = 0;

            for (let i=0; i < neighbourArray.length; i++) {
                if (neighbourArray[i].className.indexOf("live") != -1) {
                    counter++;
                }
            }

            if (this.cellIndex(x,y).className.indexOf("live") == -1) {
                if (counter == 3)  {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if ((counter <2) || (counter > 3) ) {
                    return 0;
                } else {
                    return 1;
                }
            }
        }

        computeNextGeneration = () => {
            const futureArray =[];
            for (let i=0; i < this.props.height; i++) {
                for (let j=0; j < this.props.width; j++) {
                    futureArray.push(this.computeCellNextState(j, i));
                }
            }
            return futureArray;
        }


        printNextGeneration = () => {
            const newList = this.computeNextGeneration();
            for (let i=0; i < this.cells.length; i++) {
                if ((this.cells[i].className.indexOf('live') == -1) && (newList[i] == 1)) {
                    this.cells[i].classList.add('live');
                }
                if ((this.cells[i].className.indexOf('live') != -1) && (newList[i] == 0)) {
                    this.cells[i].classList.remove('live');
                }
            }
        }

        handlePlayClick = (e) => {
            e.target.setAttribute('disabled',true);
            this.createCellArray();
            const self = this;
            this.idSetInterval = setInterval(function() {
                self.printNextGeneration();
            }, 1000);
            return self.idSetInterval;
        }

        handlePauseClick = (e) => {
            e.target.previousSibling.disabled = false;
            clearInterval(this.idSetInterval);
        }

        handleResetClick = (e) => {
            e.target.previousSibling.previousSibling.disabled = false;
            clearInterval(this.idSetInterval);
            for (let j=0; j < this.cells.length; j++) {
                if (this.cells[j].className.indexOf("live") !== -1) {
                    this.cells[j].classList.remove("live");
                }
            }
        }

        componentWillUnmount(){
            clearInterval(this.idSetInterval);
        }

        render(){
            return(
                <section className="flex-container">
                    <GameBoard width={this.props.width} height={this.props.height}/>
                    <GameMenu width={this.props.width} height={this.props.height} play={this.handlePlayClick} pause={this.handlePauseClick} reset={this.handleResetClick}/>
                </section>
            )
        }
    }

    class IntroductionDescription extends React.Component{
        render(){
            const introductionDescriptionItems = [
                "This game simulated the life of cells. If living cell is surrounded by 2 or 3 cells it will keep on living. If the dead cell is surrounded by 3 living cells it will start to live.",
                "Mark the cells using mouse and start the game by pressing the button \"Play\".",
                "Enjoy the play!"
            ];
            const articles = introductionDescriptionItems.map((element, index) => {
                return <article key={index} className="introduction_description_item">{element}</article>
            });
            return(
                <section className="introduction_description">
                    {articles}
                </section>
            )
        }
    }

    class IntroductionTitle extends React.Component{
        render(){
            return(
                <section className="introduction_title">
                    <article className="introduction_title_item">Welcome in a Game of Life simulation</article>
                </section>
            )
        }
    }

    class Introduction extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                widthSize: null,
                heightSize: null
            }
        }

        handleStartButton = () => {
            this.props.startBtn();
        }

        render(){
            const styleIntroduction = {display: this.props.displayStyle};
            return (
                <section style={styleIntroduction} className="introduction">
                    <IntroductionTitle />
                    <IntroductionDescription />
                    <button className="introduction_button" onClick={this.handleStartButton}>Start the game</button>
                </section>
            )
        }
    }


    class App extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                widthSize: 0,
                heightSize: 0,
                introductionDisplay: 'block'
            }
        }

        handleStartButton = () => {

            let widthSize = prompt("Set the board width (1 to " + maxWidth + ")");
            while ( !( (Number(widthSize) > 0) && (Number(widthSize) <= maxWidth) ) ){
                widthSize = prompt("Chosen width must be from 1 to "+ maxWidth + "\n Set the board width");
            }
            let heightSize = prompt("Set the board height (1 to " + maxHeight + ")");
            while ( !( (Number(heightSize) > 0) && (Number(heightSize) <= maxHeight) ) ){
                heightSize = prompt("Chosen height must be from 1 to "+ maxHeight + "\n Set the board height");
            }
            document.querySelector('#game-menu').style.display = 'block';
            document.querySelector('#board').style.display = 'block';
            this.setState({
                widthSize: Number(widthSize),
                heightSize: Number(heightSize),
                introductionDisplay: 'none'
            });
        }

        render(){
            return (
                <section>
                    <Introduction startBtn={this.handleStartButton} displayStyle={this.state.introductionDisplay}/>
                    <Game width={this.state.widthSize} height={this.state.heightSize}/>
                </section>
            )
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );

});