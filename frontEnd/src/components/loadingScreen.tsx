import Logo from '../../src/assets/icons/stir.png';
import './styles/loading.css';

const Loading = () => {
    return (
        <div className="loading-screen">
            {/*<div className="loading-logo-wrapper">*/}
            {/*    <img*/}
            {/*        src={Logo}*/}
            {/*        alt="Loading"*/}
            {/*        className="loading-logo"*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="loading-spinner" />
        </div>
    );
};

export default Loading;