import React from "react";
import Nav from '../Nav/Nav';
import Landing from '../Landing/Landing';
import "./App.css";
import Footer from "../Footer/Footer";
import { SAMPLE_PARAGRAPHS } from "../../data/samplePara";
import ChallengeSection from "../ChallengeSection/ChallengeSec";

const TotalTime = 60;
const DataUrl = "http://metaphorpsum.com/paragraphs/2/4"
const DefualtState = {
    selectedParagraph: "",
    timerStarted: false,
    timeRemaining: TotalTime,
    words: 0,
    characters: 0,
    wpm: 0,
    testInfo: [],
    incorrectCount: 0
}


class App extends React.Component {
    state = DefualtState

    fetchfromFallBack = () => {
        const data = SAMPLE_PARAGRAPHS[
            Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length)
        ];
        const selectedParagraphArray = data.split("");
        //  console.log("splitted array - ", selectedParagraphArray);
        const testInfo = selectedParagraphArray.map((selectedLetter) => {
            return {
                testLetter: selectedLetter,
                status: "notAttempted",
            };
        });

        this.setState({ ...DefualtState, testInfo, selectedParagraph: data });

    }

    fetchNewParagraph = () => {
        fetch(DataUrl)
            .then((response) => response.text())
            .then((data) => {
                //console.log("API RESPOSNE IS : ", data)

                const selectedParagraphArray = data.split("");
                //  console.log("splitted array - ", selectedParagraphArray);
                const testInfo = selectedParagraphArray.map((selectedLetter) => {
                    return {
                        testLetter: selectedLetter,
                        status: "notAttempted",
                    };
                });
                this.setState({ ...DefualtState, testInfo, selectedParagraph: data });
            });

    }

    componentDidMount() {
        this.fetchfromFallBack();
    };

    startAgain = () => this.fetchfromFallBack();

    startTimer = () => {
        this.setState({ timerStarted: true });
        const timer = setInterval(() => {
            //  console.log("Interval Set " + this.setState.timeRemaining);
            if (this.state.timeRemaining > 0) {
                // Change the WPM
                const check = this.state.timerStarted;
                const timeSpent = TotalTime - this.state.timeRemaining;
                const wpm = timeSpent > 0
                    ? (this.state.words / timeSpent) * TotalTime
                    : 0;

                this.setState({
                    timeRemaining: this.state.timeRemaining - 1,
                    wpm: parseInt(wpm),
                });
            }
            else {
                clearInterval(timer);
            }

        }, 1000);
    };


    handleUserInput = (inputValue) => {
        console.log(inputValue);
        if (!this.state.timerStarted) {
            this.startTimer();
        }
        const charachters = inputValue.length;
        const words = inputValue.split(" ").length;
        const index = charachters - 1;

        if (index < 0) {
            this.setState({
                testInfo: [
                    {
                        testLetter: this.state.testInfo[0].testLetter,
                        status: "notAttempted",
                    },
                    ...this.state.testInfo.slice(1),
                ],
                charachters,
                words,
            });
            return;
        }

        if (index >= this.state.selectedParagraph.length) {
            this.setState({ charachters, words });
            return;
        }

        // make a cpoy of testInfo (case for backsapcing)
        const testInfo = this.state.testInfo;
        if (!(index === this.state.selectedParagraph.length - 1))
            testInfo[index + 1].status = "notAttempted";

        // Check for mistake
        const isMistake = inputValue[index] === testInfo[index].testLetter;
        console.info(this.state.incorrectCount, 'Incorrect count', isMistake);

        // Update the testInfo
        testInfo[index].status = isMistake ? "correct" : "incorrect";

        // Update the state
        this.setState({
            testInfo,
            words,
            charachters,
            incorrectCount: isMistake ? this.state.incorrectCount : this.state.incorrectCount + 1
        });
    };
    render() {
        //    fetch(DataUrl).then(response => response.text()).then(information => {
        //        console.log("API RESPOSNE IS : ", information)
        //    }); 

        return (

            <div className="app">
                {/* Nav Section  */}
                <Nav />
                {/* Landing Page */}
                <Landing />
                {/* Challenging Section */}
                <ChallengeSection
                    selectedParagraph={this.state.selectedParagraph}
                    words={this.state.words}
                    charachters={this.state.charachters}
                    wpm={this.state.wpm}
                    timeRemaining={this.state.timeRemaining}
                    timerStarted={this.state.timerStarted}
                    testInfo={this.state.testInfo}
                    onInputChange={this.handleUserInput}
                    startAgain={this.startAgain}
                    incorrectCount={this.state.incorrectCount}
                />
                {/* Footer */}
                <Footer />
            </div>
        )
    }
};

export default App;
