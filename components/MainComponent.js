import React, { Component } from 'react';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import ContactUs from './ContactComponent';
import AboutUs from './AboutComponent';
import Favorites from './FavoriteComponent';
import Login from './LoginComponent';
import {
	View,
	Platform,
	Image,
	StyleSheet,
	ScrollView,
	Text,
	ToastAndroid,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import Constants from 'expo-constants';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import {
	fetchDishes,
	fetchComments,
	fetchPromos,
	fetchLeaders,
} from '../redux/ActionCreators';
import Reservation from './ReservationComponent';

const mapStateToProps = (state) => {
	return {
		dishes: state.dishes,
		comments: state.comments,
		promotions: state.promotions,
		leaders: state.leaders,
	};
};

const mapDispatchToProps = (dispatch) => ({
	fetchDishes: () => dispatch(fetchDishes()),
	fetchComments: () => dispatch(fetchComments()),
	fetchPromos: () => dispatch(fetchPromos()),
	fetchLeaders: () => dispatch(fetchLeaders()),
});

const LoginNavigator = createStackNavigator(
	{
		Login: Login,
	},
	{
		navigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: '#512DA8',
			},
			headerTitleStyle: {
				color: '#fff',
			},
			title: 'Login',
			headerTintColor: '#fff',
			headerLeft: (
				<Icon
					name='menu'
					size={24}
					iconStyle={{ color: 'white' }}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const FavoritesNavigator = createStackNavigator(
	{
		Favorites: { screen: Favorites },
	},
	{
		navigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: '#512DA8',
			},
			headerTitleStyle: {
				color: '#fff',
			},
			headerTintColor: '#fff',
			headerLeft: (
				<Icon
					name='menu'
					size={24}
					iconStyle={{ color: 'white' }}
					onPress={() => navigation.navigate('DrawerToggle')}
				/>
			),
		}),
	}
);

const ReservationNavigator = createStackNavigator(
	{
		Reservation: { screen: Reservation },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: '#512DA8',
			},
			headerTitleStyle: {
				color: '#fff',
			},
			headerTintColor: '#fff',
			headerLeft: (
				<Icon
					name='menu'
					size={24}
					iconStyle={{ color: 'white' }}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const HomeNavigator = createStackNavigator(
	{
		Home: {
			screen: Home,
			navigationOptions: ({ navigation }) => ({
				headerLeft: (
					<Icon
						name='menu'
						size={24}
						color='white'
						onPress={() => navigation.toggleDrawer()}
					/>
				),
			}),
		},
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: '#512DA8',
			},
			headerTitleStyle: {
				color: '#fff',
			},
			headerTintColor: '#fff',
		}),
	}
);

const AboutNavigator = createStackNavigator(
	{
		AboutUs: {
			screen: AboutUs,
			navigationOptions: ({ navigation }) => ({
				title: 'About Us',
				headerStyle: {
					backgroundColor: '#512da8',
				},
				headerTintColor: '#512da8',
				headerTitleStyle: {
					color: '#fff',
				},
				headerLeft: (
					<Icon
						name='menu'
						size={24}
						color='white'
						onPress={() => navigation.toggleDrawer()}
					/>
				),
			}),
		},
	},
	{
		initialRouteName: 'AboutUs',
	}
);

const MenuNavigator = createStackNavigator(
	{
		Menu: {
			screen: Menu,
			navigationOptions: ({ navigation }) => ({
				headerLeft: (
					<Icon
						name='menu'
						size={24}
						color='white'
						onPress={() => navigation.toggleDrawer()}
					/>
				),
			}),
		},
		Dishdetail: { screen: Dishdetail },
	},
	{
		initialRouteName: 'Menu',
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#512DA8',
			},
			headerTintColor: '#fff',
			headerTitleStyle: {
				color: '#fff',
			},
		},
	}
);

const ContactNavigator = createStackNavigator(
	{
		ContactUs: {
			screen: ContactUs,
			navigationOptions: ({ navigation }) => ({
				headerStyle: {
					backgroundColor: '#512da8',
				},
				headerTintColor: '##512da8',
				headerTitleStyle: {
					color: '#fff',
				},
				headerLeft: (
					<Icon
						name='menu'
						size={24}
						color='white'
						onPress={() => navigation.toggleDrawer()}
					/>
				),
				title: 'Contact Us',
			}),
		},
	},
	{
		initialRouteName: 'ContactUs',
	}
);

const CustomDrawerContentComponent = (props) => (
	<ScrollView>
		<SafeAreaView
			style={styles.container}
			forceInset={{ top: 'always', horizontal: 'never' }}
		>
			<View style={styles.drawerHeader}>
				<View style={{ flex: 1 }}>
					<Image
						source={require('./images/logo.png')}
						style={styles.drawerImage}
					/>
				</View>
				<View style={{ flex: 2 }}>
					<Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
				</View>
			</View>
			<DrawerItems {...props} />
		</SafeAreaView>
	</ScrollView>
);

const MainNavigator = createDrawerNavigator(
	{
		Login: {
			screen: LoginNavigator,
			navigationOptions: {
				title: 'Login',
				drawerLabel: 'Login',
				drawerIcon: ({ tintColor, focused }) => (
					<Icon
						name='sign-in'
						type='font-awesome'
						size={24}
						iconStyle={{ color: tintColor }}
					/>
				),
			},
		},
		Home: {
			screen: HomeNavigator,
			navigationOptions: {
				title: 'Home',
				drawerLabel: 'Home',
				drawerIcon: ({ tintColor }) => (
					<Icon name='home' type='font-awesome' size={24} color={tintColor} />
				),
			},
		},
		AboutUs: {
			screen: AboutNavigator,
			navigationOptions: {
				title: 'About Us',
				drawerLabel: 'About Us',
				drawerIcon: ({ tintColor }) => (
					<Icon
						name='info-circle'
						type='font-awesome'
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		Menu: {
			screen: MenuNavigator,
			navigationOptions: {
				title: 'Menu',
				drawerLabel: 'Menu',
				drawerIcon: ({ tintColor }) => (
					<Icon name='list' type='font-awesome' size={24} color={tintColor} />
				),
			},
		},
		Contact: {
			screen: ContactNavigator,
			navigationOptions: {
				title: 'Contact Us',
				drawerLabel: 'Contact Us',
				drawerIcon: ({ tintColor }) => (
					<Icon
						name='address-card'
						type='font-awesome'
						size={22}
						color={tintColor}
					/>
				),
			},
		},
		Favorites: {
			screen: FavoritesNavigator,
			navigationOptions: {
				title: 'My Favorites',
				drawerLabel: 'My Favorites',
				drawerIcon: ({ tintColor, focused }) => (
					<Icon
						name='heart'
						type='font-awesome'
						size={24}
						iconStyle={{ color: tintColor }}
					/>
				),
			},
		},
		Reservation: {
			screen: ReservationNavigator,
			navigationOptions: {
				title: 'Reserve Table',
				drawerLabel: 'Reserve Table',
				drawerIcon: ({ tintColor, focused }) => (
					<Icon
						name='cutlery'
						type='font-awesome'
						size={24}
						iconStyle={{ color: tintColor }}
					/>
				),
			},
		},
	},
	{
		initialRouteName: 'Home',
		drawerBackgroundColor: '#D1C4E9',
		contentComponent: CustomDrawerContentComponent,
	}
);

const MenuNavigatorContainer = createAppContainer(MainNavigator);

class Main extends Component {
	componentDidMount() {
		this.props.fetchDishes();
		this.props.fetchComments();
		this.props.fetchPromos();
		this.props.fetchLeaders();

		NetInfo.fetch().then((connectionInfo) => {
			ToastAndroid.show(
				'Initial Network Connectivity Type: ' +
					connectionInfo.type +
					', effectiveType: ' +
					connectionInfo.effectiveType,
				ToastAndroid.LONG
			);
		});

		// NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
		NetInfo.addEventListener((connectionInfo) => {
			switch (connectionInfo.type) {
				case 'none':
					ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
					break;
				case 'wifi':
					ToastAndroid.show(
						'You are now connected to WiFi!',
						ToastAndroid.LONG
					);
					break;
				case 'cellular':
					ToastAndroid.show(
						'You are now connected to Cellular!',
						ToastAndroid.LONG
					);
					break;
				case 'unknown':
					ToastAndroid.show(
						'You now have unknown connection!',
						ToastAndroid.LONG
					);
					break;
				default:
					break;
			}
		});
	}

	componentWillUnmount() {
		NetInfo.removeEventListener(
			'connectionChange',
			this.handleConnectivityChange
		);
	}

	// handleConnectivityChange = (connectionInfo) => {
	// 	switch (connectionInfo.type) {
	// 		case 'none':
	// 			ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
	// 			break;
	// 		case 'wifi':
	// 			ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
	// 			break;
	// 		case 'cellular':
	// 			ToastAndroid.show(
	// 				'You are now connected to Cellular!',
	// 				ToastAndroid.LONG
	// 			);
	// 			break;
	// 		case 'unknown':
	// 			ToastAndroid.show(
	// 				'You now have unknown connection!',
	// 				ToastAndroid.LONG
	// 			);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// };
	render() {
		return (
			<View
				style={{
					flex: 1,
					paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
				}}
			>
				<MenuNavigatorContainer />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	drawerHeader: {
		backgroundColor: '#512DA8',
		height: 140,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'row',
	},
	drawerHeaderText: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
	drawerImage: {
		margin: 10,
		width: 80,
		height: 60,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
