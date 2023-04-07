import math
import random, sys


class Card:
    def __init__(self,value,suit):
        self.cost = value
        self.value = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][value-1]
        self.suit = '♥♦♣♠'[suit]
        
    def price(self):
        if self.cost >= 10:
            return 10
        elif self.cost == 1:
            return 11
        return self.cost

class Deck:
    def __init__(self):
        self.cards = []

    def generate(self):
        for i in range(1, 14):
            for j in range(4):
                self.cards.append(Card(i, j))
    
    def draw(self, iteration):
        cards = []
        for i in range(iteration):
            card = random.choice(self.cards)
            self.cards.remove(card)
            cards.append(card)
        return cards

    def count(self):
        return len(self.cards)




class Gambler:
  def __init__(self, hit, stand, double_down, card_count):
    self.hit = hit
    self.stand = stand
    self.double_down = double_down
  

class Dealer:
  def __init__(self, hit, stand, card_count):
    self.hit = hit
    self.stand = stand
  


possible_cards = ['2','3','4','5','6','7','8','9','10']
faces = {
    1: 'Ace',
    2: '2',
    3: '3',
}


player1_hand = []
def value():
    hand_total = 0
    # Add in a dict of "rank values" (excluding the Ace)
    rank_values = {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8,
                   '9':9, '10':10, 'J':10, 'Q':10, 'K':10}
    for i in range(len(player1_hand)):
        card = player1_hand[i][0] # the added index will get the card          
        if card == 'A':          # without the suit.
            print("Please choose between 1 and 11.")
            value_a = input("---> ")
            hand_total += int(value_a) # add a type check before this
        else:
            hand_total += rank_values[card]
    return hand_total


card_1 = random.choice(possible_cards)
card_2 = random.choice(possible_cards)

coin_pouch = 100

#Initial Prompt
while True:
  try:
    initial_bet = input("It's time to play blackjack. Your current coin pouch has {coin_pouch} coins. How much would you like to bet? ".format(coin_pouch = coin_pouch))
    if int(initial_bet) > 0 and int(initial_bet) < int(coin_pouch):
      print("You have bet {initial_bet}. Let's play!".format(initial_bet = initial_bet))
      break;
    elif int(initial_bet) == 0:
      print("You can't bet nothing.")
    elif int(initial_bet) < 0:
      print("You can't bet negative money...")
    else:
       if int(initial_bet) > int(coin_pouch):
        print("You can't bet more than you have in your coin pouch. You currently have {coin_pouch} in your coin pouch.".format(coin_pouch = coin_pouch))     
  except ValueError:
    print("Provide an integer value...")
    continue

current_total = []
card_draw = input("Your first card is {card_1}, your second card is {card_2}. What do you wish to do now? ".format(card_1 = card_1, card_2 = card_2))
#current_total += int(card_1) + int(card_2)
#what_now = input("Your you a current total is {current_total} What do you wish to do? ".format(current_total = current_total))


while card_draw != 'hit' and card_draw != 'stand':
  card_draw = input("Whoops, you didnt select 'Hit' or 'Stand'. Try selecting one again! ")








#coin_pouch += winnings 
#coin_pouch -= losings
