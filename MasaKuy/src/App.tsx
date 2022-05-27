import { Redirect, Route } from 'react-router-dom';
import {
	IonApp,
	IonRouterOutlet,
	IonSpinner,
	setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MainMenu from './pages/MainMenu';
import PostRecipe from './pages/PostRecipe';
import RecipeDetail from './pages/RecipeDetail';
import CommentRecipe from './pages/CommentRecipe';
import { useState, useEffect } from 'react';
import { getCurrUser } from './FirebaseConfig';
import SearchRecipe from './pages/SearchRecipe';
import MyPost from './pages/MyPost';
import AboutUs from './pages/AboutUs';

setupIonicReact();

const RoutingSystem: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path='/home'>
						<Home />
					</Route>
					<Route exact path='/login'>
						<Login />
					</Route>
					<Route exact path='/signup'>
						<Signup />
					</Route>
					<Route exact path='/mainmenu'>
						<MainMenu />
					</Route>
					<Route exact path='/postrecipe'>
						<PostRecipe />
					</Route>
					<Route exact path='/profile'>
						<Profile />
					</Route>
					<Route exact path='/search'>
						<SearchRecipe />
					</Route>
					<Route exact path='/aboutus'>
						<AboutUs />
					</Route>
					<Route exact path='/'>
						<Redirect to='/home' />
					</Route>
					<Route path="/post/:recipeId">
						<RecipeDetail />
					</Route>
					<Route path='/commentrecipe/:rId'>
						<CommentRecipe />
					</Route>
					<Route exact path='/mypost'>
						<MyPost />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

const App: React.FC = () => {
	const [busy, setBusy] = useState(true);

	useEffect(() => {
		getCurrUser().then(user => {
			if (user) { } else {
				window.history.replaceState({}, '', '/');
			}
			setBusy(false);
		});
	}, []);

	return <IonApp>{busy ? <IonSpinner /> : <RoutingSystem />}</IonApp>;
};

export default App;
