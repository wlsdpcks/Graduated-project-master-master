import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Calls from '../Components/calls/Calls';
import { theme } from '../ChatTheme';
import { fabStyles } from '../styles';

const CallsScreens = () => {
	return (
		<View style={{ flex: 1 }}>
			<ScrollView>
				<Calls />
			</ScrollView>
			<TouchableOpacity style={fabStyles.style}>
				<Icon name="phone" size={25} color={theme.colors.primary} />
			</TouchableOpacity>
		</View>
	)
}

export default CallsScreens