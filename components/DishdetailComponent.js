import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	FlatList,
	Modal,
	StyleSheet,
	Button,
	Alert,
	PanResponder,
	Share,
} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = (state) => {
	return {
		dishes: state.dishes,
		comments: state.comments,
		favorites: state.favorites,
	};
};

const mapDispatchToProps = (dispatch) => ({
	postFavorite: (dishId) => dispatch(postFavorite(dishId)),
	postComment: (rating, author, comment, dishId, commentId) =>
		dispatch(postComment(rating, author, comment, dishId, commentId)),
});

function RenderDish(props) {
	const dish = props.dish;

	handleViewRef = (ref) => (this.view = ref);

	const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
		if (dx < -200) return true;
		else return false;
	};

	const recognizeComment = ({ moveX, moveY, dx, dy }) => {
		if (dx > 50 && dx < 200) return true;
		else return false;
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: (e, gestureState) => {
			return true;
		},

		onPanResponderGrant: () => {
			this.view
				.rubberBand(1000)
				.then((endState) =>
					console.log(endState.finished ? 'finished' : 'cancelled')
				);
		},

		onPanResponderEnd: (e, gestureState) => {
			console.log('pan responder end', gestureState);
			if (recognizeDrag(gestureState)) {
				Alert.alert(
					'Add Favorite',
					'Are you sure you wish to add ' + dish.name + ' to favorite?',
					[
						{
							text: 'Cancel',
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
						{
							text: 'OK',
							onPress: () => {
								props.favorite
									? console.log('Already favorite')
									: props.onPress();
							},
						},
					],
					{ cancelable: false }
				);
			} else if (recognizeComment(gestureState)) {
				props.toggleModal();
			}
			return true;
		},
	});
	const shareDish = (title, message, url) => {
		Share.share(
			{
				title: title,
				message: title + ': ' + message + ' ' + url,
				url: url,
			},
			{
				dialogTitle: 'Share ' + title,
			}
		);
	};
	if (dish != null) {
		return (
			<Animatable.View
				animation='fadeInDown'
				duration={2000}
				delay={1000}
				ref={this.handleViewRef}
				{...panResponder.panHandlers}
			>
				<Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
					<Text style={{ margin: 10 }}>{dish.description}</Text>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							flex: 1,
							flexDirection: 'row',
						}}
					>
						<Icon
							raised
							reverse
							name={props.favorite ? 'heart' : 'heart-o'}
							type='font-awesome'
							color='#f50'
							onPress={() =>
								props.favorite
									? console.log('Already favorite')
									: props.onPress()
							}
						/>
						<Icon
							raised
							reverse
							name='pencil'
							type='font-awesome'
							color='#512DA8'
							onPress={() => props.toggleModal()}
						/>
						<Icon
							raised
							reverse
							name='share'
							type='font-awesome'
							color='#51D2A8'
							onPress={() =>
								shareDish(dish.name, dish.description, baseUrl + dish.image)
							}
						/>
					</View>
				</Card>
			</Animatable.View>
		);
	} else {
		return <View></View>;
	}
}

function RenderComments(props) {
	const comments = props.comments;

	const renderCommentItem = ({ item, index }) => {
		return (
			<View key={index} style={{ margin: 10 }}>
				<Text style={{ fontSize: 14 }}>{item.comment}</Text>
				<Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
				<Text style={{ fontSize: 12 }}>
					{'-- ' + item.author + ', ' + item.date}{' '}
				</Text>
			</View>
		);
	};

	return (
		<Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
			<Card title='Comments'>
				<FlatList
					data={comments}
					renderItem={renderCommentItem}
					keyExtractor={(item) => item.id.toString()}
				/>
			</Card>
		</Animatable.View>
	);
}

class DishDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			rating: 3,
			author: '',
			comment: '',
		};
	}

	static navigationOptions = {
		title: 'Dish Details',
	};

	markFavorite(dishId) {
		this.props.postFavorite(dishId);
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	handleSubmit = () => {
		this.props.postComment(
			this.state.rating,
			this.state.author,
			this.state.comment,
			this.props.navigation.getParam('dishId'),
			this.props.comments.comments.length
		);
		this.resetForm();
		this.toggleModal();
	};

	resetForm() {
		this.setState({
			showModal: false,
			rating: 3,
			author: '',
			comment: '',
		});
	}

	ratingCompleted = (rating) => {
		this.setState({
			rating: rating,
		});
	};

	render() {
		const dishId = this.props.navigation.getParam('dishId', '');
		return (
			<ScrollView>
				<RenderDish
					dish={this.props.dishes.dishes[+dishId]}
					favorite={this.props.favorites.some((el) => el === dishId)}
					onPress={() => this.markFavorite(dishId)}
					toggleModal={() => {
						this.toggleModal();
					}}
				/>
				<RenderComments
					comments={this.props.comments.comments.filter(
						(comment) => comment.dishId === dishId
					)}
				/>
				<Modal
					animationType={'slide'}
					transparent={false}
					visible={this.state.showModal}
					onDismiss={() => this.toggleModal()}
					onRequestClose={() => this.toggleModal()}
				>
					<View>
						<Rating showRating onFinishRating={this.ratingCompleted} />
						<Input
							placeholder='Author'
							leftIcon={
								<Icon
									name='user-o'
									type='font-awesome'
									size={24}
									color='black'
								/>
							}
							onChangeText={(value) => {
								this.setState({
									author: value,
								});
							}}
						/>
						<Input
							placeholder='Comment'
							leftIcon={
								<Icon
									name='comment-o'
									type='font-awesome'
									size={24}
									color='black'
								/>
							}
							onChangeText={(value) => {
								this.setState({
									comment: value,
								});
							}}
						/>
						<View style={{ margin: 10 }}>
							<Button
								title='SUBMIT'
								color='#512DA8'
								onPress={this.handleSubmit}
							/>
						</View>
						<View style={{ margin: 10 }}>
							<Button title='CANCEL' color='grey' onPress={this.toggleModal} />
						</View>
					</View>
				</Modal>
			</ScrollView>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
