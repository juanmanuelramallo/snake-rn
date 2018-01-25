import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      points: 0,
      food: false,
      foodPosition: {
        x: 0,
        y: 0
      },
      moveTo: 'right',
      backgroundColor: '#333',
      position: {
        x: 10,
        y: 45
      }
    };
    let { height, width } = Dimensions.get('window');

    this.waitTime = 15;

    this.stepX = 1;
    this.stepY = this.stepX * width / height;

    this.snakeSizePercentageX = 8;
    this.snakeSizePercentageY = this.snakeSizePercentageX * width / height;

    this.foodSizePercentageX = 6;
    this.foodSizePercentageY = this.foodSizePercentageX * width / height;

    this.maxPositions = {
      xmax: 100 - this.snakeSizePercentageX,
      xmin: this.snakeSizePercentageX,
      ymax: 100 - this.snakeSizePercentageY,
      ymin: this.snakeSizePercentageY
    }
  }


  componentDidMount() {
    this.moveSnakeInterval = setInterval(() => this.moveSnake(), this.waitTime);
    setTimeout(() => this.generateFood(), 1000);
  }


  moveSnake() {
    let { position, moveTo, food, foodPosition, points } = this.state;
    switch (moveTo) {
      case 'right':
        position.x += this.stepX;
        if (position.x > this.maxPositions.xmax) {
          position.x = this.maxPositions.xmin;
        }
        break;
      case 'left':
        position.x -= this.stepX;
        if (position.x < this.maxPositions.xmin) {
          position.x = this.maxPositions.xmax;
        }
        break;
      case 'up':
        position.y -= this.stepY;
        if (position.y < this.maxPositions.ymin) {
          position.y = this.maxPositions.ymax;
        }
        break;
      case 'down':
        position.y += this.stepY;
        if (position.y > this.maxPositions.ymax) {
          position.y = this.maxPositions.ymin;
        }
        break;
    }

    if (food) {
      const snakeArea = {
        xmin: position.x,
        xmax: position.x + this.snakeSizePercentageX,
        ymin: position.y,
        ymax: position.y + this.snakeSizePercentageY
      };

      const foodArea = {
        xmin: foodPosition.x,
        xmax: foodPosition.x + this.foodSizePercentageX,
        ymin: foodPosition.y,
        ymax: foodPosition.y + this.foodSizePercentageY
      };

      const foodCenterX = (foodArea.xmax + foodArea.xmin) /2,
            foodCenterY = (foodArea.ymax + foodArea.ymin)/2;
      // console.log('snake'); console.log(snakeArea);
      // console.log('food'); console.log(foodArea);
      // console.log(`foodcenter: ${foodCenterX} ${foodCenterY}`);

      if (foodCenterX > snakeArea.xmin && foodCenterX < snakeArea.xmax && foodCenterY > snakeArea.ymin && foodCenterY < snakeArea.ymax) {
        food = false;
        points += 1;
      }
    }

    this.setState({ position, points, food }, () => this.generateFood());
  }


  generateFood() {
    let { food } = this.state;
    if (!food) {
      let foodPosition = {
        x: Math.floor((Math.random() * 80) + 20),
        y: Math.floor((Math.random() * 80) + 20)
      }
      this.setState({ food: true, foodPosition });
    }
  }


  onSwipeUp(gestureState) {
    const { moveTo } = this.state;
    if (moveTo !== 'down') {
      this.setState({ moveTo: 'up' });
    }
  }


  onSwipeDown(gestureState) {
    const { moveTo } = this.state;
    if (moveTo !== 'up') {
      this.setState({ moveTo: 'down' });
    }
  }


  onSwipeLeft(gestureState) {
    const { moveTo } = this.state;
    if (moveTo !== 'right') {
      this.setState({ moveTo: 'left' });
    }
  }


  onSwipeRight(gestureState) {
    const { moveTo } = this.state;
    if (moveTo !== 'left') {
      this.setState({ moveTo: 'right' });
    }
  }


  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    const { position, food, foodPosition, points } = this.state;
    let foodEl;

    if (food) {
      foodEl = <View style={{
        backgroundColor: 'grey',
        position: 'relative',
        width: `${this.foodSizePercentageX}%`,
        height: `${this.foodSizePercentageY}%`,
        top: `${foodPosition.y}%`,
        left: `${foodPosition.x}%`
      }} />;
    }

    return (
      <GestureRecognizer
        onSwipeUp={ state => this.onSwipeUp(state) }
        onSwipeDown={ state => this.onSwipeDown(state) }
        onSwipeLeft={ state => this.onSwipeLeft(state) }
        onSwipeRight={ state => this.onSwipeRight(state) }
        config={ config }
        style={{ flex: 1, backgroundColor: this.state.backgroundColor }} >

        <Text style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          color: 'white',
          fontSize: 26 }}>Points: { points }</Text>

        <View style={{
          backgroundColor: 'white',
          position: 'relative',
          width: `${this.snakeSizePercentageX}%`,
          height: `${this.snakeSizePercentageY}%`,
          top: `${position.y}%`,
          left: `${position.x}%`
        }} />

        {foodEl}

      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
});
