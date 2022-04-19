import "./Home.scss";

const Home = ({user}) => (
    <div className={"home"}>
        <p>{JSON.stringify(user)}</p>
        <p>TODO</p>
    </div>

);
export default Home;