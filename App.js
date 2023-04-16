import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  Pressable,
} from 'react-native';
import Constants from 'expo-constants';
import 'react-native-random-uuid';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function App() {
  const [numbers, setNumbers] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [time, setTime] = React.useState(() => Date.now());

  function allNewDice() {
    return Array.from({ length: 10 }, () => makeObj());
  }

  function makeObj() {
    return {
      id: crypto.randomUUID(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function handleRoll() {
    if (tenzies) {
      setNumbers(allNewDice());
      setTenzies(false);
      setCount(0);
      setTime(() => Date.now());
    } else {
      setNumbers((prevState) =>
        prevState.map((number) => {
          return number.isHeld ? number : makeObj();
        })
      );
      setCount((count) => count + 1);
    }
  }

  function holdDice(id) {
    setNumbers((prevState) => {
      let newArr = [];
      for (let i = 0; i < prevState.length; i++) {
        if (prevState[i].id === id) {
          let newObj = { ...prevState[i] };
          newObj.isHeld = !newObj.isHeld;
          newArr.push(newObj);
        } else {
          newArr.push(prevState[i]);
        }
      }
      return newArr;
    });
  }

  React.useEffect(() => {
    let winner = numbers.every(
      (number, i, arr) => number.isHeld && number.value === arr[0].value
    );
    if (winner) {
      setTenzies(true);
      setTime((prevState) => Date.now() - prevState);
    }
  }, [numbers]);

  /*
  type DieProps = {
    id: string,
    value: number,
    isHeld: boolean,
    holdDice: function,
  };
  */

  const Die = (props) => ( // props:DieProps
    <View
      id={props.id}
      style={[styles.tile, props.isHeld ? styles.held : styles.notHeld]}>
      <Text style={styles.tileText}>{props.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.h1}>Tenzies</Text>
        <Text style={styles.paragraph}>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </Text>
        <FlatList
          style={{ margin: 'auto' }}
          numColumns={5}
          horizontal={false}
          contentContainerStyle={{ alignItems: 'stretch' }}
          data={numbers}
          renderItem={({ item }) => (
            <Pressable onPress={() => holdDice(item.id)}>
              <Die id={item.id} isHeld={item.isHeld} value={item.value} />
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />

        <View style={tenzies ? styles.visible : styles.invisible}>
          You won in {count} rolls and {Math.floor(time / 1000)} seconds
        </View>
        <Button
          //accessibilityLabel ?
          color="#5035ff"
          title={tenzies ? 'New Game' : 'Roll'}
          onPress={handleRoll}
        />
        {tenzies && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //gap: 20,
    padding: 10,
    paddingTop: Constants.statusBarHeight,
    textAlign: 'center',
    backgroundColor: '#0b2434',
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    gap: 20,
    borderRadius: 8,
    paddingBottom: 50,
  },
  paragraph: {
    margin: 20,
    fontSize: 18,
    //fontWeight: 'bold',
    textAlign: 'center',
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tile: {
    height: 50,
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    marginBottom: 20,
    borderRadius: 8,
    boxShadow: '0 2px 2px rgba(0,0,0,.15)',
  },
  tileText: {
    fontWeight: 'bold',
  },
  held: {
    border: '1px solid',
    color: '#fff',
    backgroundColor: '#59E391',
  },
  notHeld: {
    backgroundColor: '#fff',
  },
  invisible: {
    visibility: 'hidden',
  },
  visible: {
    visibility: 'visible',
  },
});
