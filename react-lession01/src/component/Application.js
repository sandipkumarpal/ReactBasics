import React from 'react';
import PropTypes from 'prop-types';

let nextId = 4;

class Stopwatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false,
            elapsedTime: 0,
            previousTime: 0
        }
        this.onTick =this.onTick.bind(this);
    }
    componentDidMount() {
        this.interval = setInterval(this.onTick, 100);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    onTick() {
        // console.log('Tick');
        if(this.state.running) {
            let now = Date.now();
            this.setState({
                previousTime: now,
                elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
            });
        }
    }
    onStop() {
        this.setState({running: false});
    }
    onStart() {
        this.setState({
            running: true,
            previousTime: Date.now()
        });
    }
    onReset() {
        this.setState({
            elapsedTime: 0,
            previousTime: Date.now()
        })
    }
    render() {
        const seconds = Math.floor(this.state.elapsedTime / 1000);
        return (
            <div className="stopwatch">
                <h4>Stopwatch</h4>
                <div className="stopwatch-time">{seconds}</div>
                {this.state.running ? <button onClick={() => this.onStop()} className="btn btn-primary">Stop</button> : 
                <button onClick={() => this.onStart()} className="btn btn-primary">Start</button>}
                <button onClick={() => this.onReset()} className="btn btn-primary">Reset</button>
            </div>
        );
    }
}

class AddPlayerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.onAdd(this.state.name);
        this.setState({name: ''});
    }
    render() {
        return (
            <div>
                <hr/>
                <form className="form-inline" onSubmit={(e) => this.handleSubmit(e)}>
                    <div className=" mx-sm-3">
                        <input type="text" 
                            className="form-control" 
                            id="inputPassword2" 
                            placeholder="Add Player"
                            value={this.state.name}
                            onChange={(e) => this.setState({name: e.target.value})}/>
                    </div>
                    <button type="submit" 
                        className="btn btn-primary">
                        Add Player</button>
                </form>
            </div>
        );
    }
}
AddPlayerForm.propTypes = {
    onAdd: PropTypes.func.isRequired
};

function Stats(props) {
    const playerItems = props.players.length;
    const totalPoints = props.players.reduce(function(total, players){
        return total + players.score
    }, 0);
    return (
        <table className="table">
            <tbody>
                <tr>
                    <td>Player: </td>
                    <td>{playerItems}</td>
                </tr>
                <tr>
                    <td>Total Points: </td>
                    <td>{totalPoints}</td>
                </tr>
            </tbody>
        </table>
    );
}
Stats.propTypes = {
    players: PropTypes.array.isRequired
};

function Header (props) {
    return (
        <header>
            <h3>{props.title}</h3>
            <Stats players={props.player}/>
            <Stopwatch/>
            <hr/>
        </header>
    );
}
Header.propTypes = {
    title: PropTypes.string.isRequired,
    player: PropTypes.array.isRequired
};

function Counter(props) {
    return (
        <div>
            <span className="badge badge-primary badge-pill">{props.score}</span>
            <button className="btn btn-danger" 
                onClick={function() {props.onChange(-1)}}> - </button>
            <button className="btn btn-primary"
                onClick={function() {props.onChange(+1)}}> + </button>
        </div>
    );
}

Counter.propTypes = {
    score: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

function Player (props) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            {props.name}
            <a onClick={props.onRemove}>X</a>
            <Counter score={props.score} onChange={props.onScoreChange}/>
        </li>
    );
}

Player.propTypes = {
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    onScoreChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

class Application extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            player : props.player
        }
        this.onPlayerAdd = this.onPlayerAdd.bind(this);
    }
    onScoreChange(delta, index) {
        console.log('onScoreChange', delta, index);
        this.state.player[index].score += delta;
        this.setState(this.state);
    }
    onPlayerAdd(name) {
        console.log('Player Add', name);
        this.state.player.push({
            name: name,
            score: 0,
            id: nextId
        });
        this.setState(this.state);
        nextId += 1;
    }
    onRemovePlayer(index) {
        console.log('Remove', index);
        this.state.player.splice(index, 1);
        this.setState(this.state);
    }
    render() {
        return (
            <div className="container">
                <Header title={this.props.title} player={this.state.player}/>
                <div className="players">
                    <div className="player">
                        <ul className="list-group">
                            {this.state.player.map(function(player, index){
                                return <Player name={player.name}
                                            onRemove={() => this.onRemovePlayer(index)}
                                            score={player.score} 
                                            key={player.id}
                                            onScoreChange={(delta) => this.onScoreChange(delta, index)}/>
                            }.bind(this))}
                        </ul>
                    </div>
                </div>
                <AddPlayerForm onAdd={this.onPlayerAdd}/>
            </div>
        );
    }
}

Application.propTypes = {
    title: PropTypes.string.isRequired,
    player: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired
    })).isRequired,
};

Application.defaultProps = {
    title: 'Application',
    player: ''
};

export default Application;
