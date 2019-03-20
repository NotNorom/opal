import React, { Component } from 'react';
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Queue from "./Queue/Queue";
import "./fonts/sinkin-sans/sinkin-sans.css";
import "./App.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoPlay: false,
            timerSeconds: 0,
            currentlyPlaying: "b06pKMxF6h8",
            queue: [
                "lBsq4DC6Jv4",
                "WZFVeSZrM_I",
            ]
        }
        this.skip = this.skip.bind(this);

        this.setCurrentlyPlaying = this.setCurrentlyPlaying.bind(this);
        this.moveEntryUp = this.moveEntryUp.bind(this);
        this.moveEntryDown = this.moveEntryDown.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);

        this.handleAutoPlayChange = this.handleAutoPlayChange.bind(this);
        this.handleTimerSecondsChange = this.handleTimerSecondsChange.bind(this);

        this.handleVideoEnd = this.handleVideoEnd.bind(this);
    }

    skip() {
        if(this.state.queue.length === 0) {return};
        var entry = this.state.queue[0];
        this.setCurrentlyPlaying(entry, 0);
        this.deleteEntry(entry, 0);
    }

    setCurrentlyPlaying(videoId, index) {
        console.info(`Setting ${videoId} as currentlyPlaying`);
        this.setState({currentlyPlaying: videoId});
    }

    moveEntryUp(videoId, index) {
        console.info(`Moving ${videoId} at index: ${index} up`);
        if(index === 0) {return} // first entry
        var newQueue = this.state.queue;
        // https://stackoverflow.com/questions/872310/javascript-swap-array-elements
        [newQueue[index-1], newQueue[index]] = [newQueue[index], newQueue[index-1]];
        this.setState({queue: newQueue});
    }

    moveEntryDown(videoId, index) {
        console.info(`Moving ${videoId} at index: ${index} down`);
        if(index === this.state.queue.length-1) {return} // last entry
        var newQueue = this.state.queue;
        // https://stackoverflow.com/questions/872310/javascript-swap-array-elements
        [newQueue[index+1], newQueue[index]] = [newQueue[index], newQueue[index+1]];
        this.setState({queue: newQueue});
    }

    deleteEntry(videoId, index) {
        console.info(`Deleting ${videoId} at index: ${index}`);
        var newQueue = this.state.queue;
        newQueue.splice(index, 1);
        this.setState({queue: newQueue});
    }

    handleAutoPlayChange() {
        this.setState({autoPlay: !this.state.autoPlay}, () => {
            console.info(`Changing autoplay to ${this.state.autoPlay}`);
        });
    }

    handleTimerSecondsChange(event) {
        this.setState({timerSeconds: event.target.value}, () => {
            console.info(`Changing timerSeconds to ${this.state.timerSeconds}`);
        });
    }

    handleVideoEnd(event) {
        if(!this.state.autoPlay) {return};
        var timeout = this.state.timerSeconds * 1000;
        setTimeout(() => {
            console.info(`Playing next video in ${timeout} miliseconds`);
            if(this.state.queue.length === 0) {
                //this.setCurrentlyPlaying("", 0);
                return;
            };
            var entry = this.state.queue[0];
            this.setCurrentlyPlaying(entry, 0);
            this.deleteEntry(entry, 0);
            event.target.playVideo();
        }, timeout);
        console.log(event);
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <VideoPlayer
                        videoId={this.state.currentlyPlaying}
                        onSkip={this.skip}
                        autoPlay={this.state.autoPlay}
                        onAutoPlayChange={this.handleAutoPlayChange}
                        timerSeconds={this.state.timerSeconds}
                        onTimerSecondsChange={this.handleTimerSecondsChange}
                        onVideoEnd={this.handleVideoEnd}
                    />
                </header>
                <main>
                    <Queue
                        queue={this.state.queue}
                        onPlay={this.setCurrentlyPlaying}
                        onMoveUp={this.moveEntryUp}
                        onMoveDown={this.moveEntryDown}
                        onDelete={this.deleteEntry}
                    />
                </main>
            </React.Fragment>
        );
    }
}

export default App;