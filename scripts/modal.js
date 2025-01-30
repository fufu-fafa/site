// Code snippets for projects
const codeSnippets = {
    tetriscode: `
import pygame
import random
import os

# Initialize pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 300
SCREEN_HEIGHT = 600
GRID_SIZE = 30

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
CYAN = (0, 255, 255)
MAGENTA = (255, 0, 255)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)

COLORS = [RED, GREEN, BLUE, CYAN, MAGENTA, YELLOW, ORANGE]

# Tetromino shapes
SHAPES = [
    [[1, 1, 1],
     [0, 1, 0]],

    [[0, 1, 1],
     [1, 1, 0]],

    [[1, 1, 0],
     [0, 1, 1]],

    [[1, 1],
     [1, 1]],

    [[1, 1, 1, 1]],

    [[1, 1, 1],
     [1, 0, 0]],

    [[1, 1, 1],
     [0, 0, 1]]
]

class Tetromino:
    def __init__(self, shape, color):
        self.shape = shape
        self.color = color
        self.x = 3
        self.y = 0

    def rotate(self):
        self.shape = [list(row) for row in zip(*self.shape[::-1])]

class TetrisGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH + 150, SCREEN_HEIGHT))  # Extra space for next blocks
        self.clock = pygame.time.Clock()
        self.grid = [[BLACK for _ in range(10)] for _ in range(20)]
        self.current_tetromino = self.generate_tetromino()
        self.next_tetrominos = [self.generate_tetromino() for _ in range(3)]  # Queue for the next three blocks
        self.running = True
        self.paused = False
        self.hold_tetromino = None
        self.hold_used = False
        self.score = 0


    def hold_current_tetromino(self):
        if not self.hold_used:
            if self.hold_tetromino is None:
                self.hold_tetromino = self.current_tetromino
                self.current_tetromino = self.next_tetrominos.pop(0)
                self.next_tetrominos.append(self.generate_tetromino())
            else:
                self.hold_tetromino, self.current_tetromino = self.current_tetromino, self.hold_tetromino
                self.current_tetromino.x, self.current_tetromino.y = 3, 0  # Reset position
            self.hold_used = True
    
    def draw_hold_tetromino(self):
        if self.hold_tetromino:
            # Positioning the hold tetromino
            start_x = (SCREEN_WIDTH // GRID_SIZE) + 1
            start_y = (SCREEN_HEIGHT // GRID_SIZE) - len(self.hold_tetromino.shape) - 1
            
            for y, row in enumerate(self.hold_tetromino.shape):
                for x, cell in enumerate(row):
                    if cell:
                        # Draw the tetromino block
                        pygame.draw.rect(
                            self.screen,
                            self.hold_tetromino.color,
                            ((start_x + x) * GRID_SIZE, (start_y + y) * GRID_SIZE, GRID_SIZE, GRID_SIZE),
                            0
                        )
                        
                        pygame.draw.rect(
                            self.screen,
                            BLACK,
                            ((start_x + x) * GRID_SIZE, (start_y + y) * GRID_SIZE, GRID_SIZE, GRID_SIZE),
                            1  # Border thickness
                        )


    def generate_tetromino(self):
        shape = random.choice(SHAPES)
        color = random.choice(COLORS)
        return Tetromino(shape, color)

    def valid_move(self, tetromino, dx, dy):
        for y, row in enumerate(tetromino.shape):
            for x, cell in enumerate(row):
                if cell:
                    new_x = tetromino.x + x + dx
                    new_y = tetromino.y + y + dy
                    if new_x < 0 or new_x >= 10 or new_y >= 20 or (new_y >= 0 and self.grid[new_y][new_x] != BLACK):
                        return False
        return True

    def place_tetromino(self, tetromino):
        for y, row in enumerate(tetromino.shape):
            for x, cell in enumerate(row):
                if cell:
                    self.grid[tetromino.y + y][tetromino.x + x] = tetromino.color

    def clear_lines(self):
        new_grid = [row for row in self.grid if any(cell == BLACK for cell in row)]
        lines_cleared = 20 - len(new_grid)
        for _ in range(lines_cleared):
            new_grid.insert(0, [BLACK for _ in range(10)])
        self.grid = new_grid

        # Scoring
        if lines_cleared > 0:
            points = {1: 100, 2: 300, 3: 500, 4: 800}  
            self.score += points.get(lines_cleared, 0)

    def draw_score(self):
        font = pygame.font.SysFont(["helvetica", "arial", "sans-serif"], 15)
        score_text = font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (SCREEN_WIDTH - 290, 10))

    def draw_grid(self):
        for y in range(20):
            for x in range(10):
                pygame.draw.rect(self.screen, self.grid[y][x], (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE), 0)
                pygame.draw.rect(self.screen, BLACK, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE), 1)
                separator_x = 10 * GRID_SIZE  # Right edge of the playable grid
                pygame.draw.line(self.screen, (200, 200, 200), (separator_x, 0), (separator_x, SCREEN_HEIGHT), 2)  # Light gray line


    def draw_tetromino(self, tetromino, offset_x=0, offset_y=0):
        for y, row in enumerate(tetromino.shape):
            for x, cell in enumerate(row):
                if cell:
                    pygame.draw.rect(
                        self.screen,
                        tetromino.color,
                        ((tetromino.x + x + offset_x) * GRID_SIZE, (tetromino.y + y + offset_y) * GRID_SIZE, GRID_SIZE, GRID_SIZE),
                        0
                    )

    def draw_next_tetrominos(self):
        start_x = 10  # Offset for next blocks
        start_y = 0
        for i, tetromino in enumerate(self.next_tetrominos):
            offset_y = i * 5  # Space between blocks
            for y, row in enumerate(tetromino.shape):
                for x, cell in enumerate(row):
                    if cell:
                        pygame.draw.rect(
                            self.screen,
                            tetromino.color,
                            ((start_x + x) * GRID_SIZE, (start_y + y + offset_y) * GRID_SIZE, GRID_SIZE, GRID_SIZE),
                            0
                        )
  
    def draw_pause_menu(self):
        font1 = pygame.font.SysFont(["helvetica", "arial", "sans-serif"], 28)
        font2 = pygame.font.SysFont(["helvetica", "arial", "sans-serif"], 20)
        pause_text = font1.render("Paused", True, WHITE)
        quit_text = font2.render("Press Q to Quit", True, WHITE)
        continue_text = font2.render("Press C to Continue", True, WHITE)

        # Calculate the background rectangle
        rect_width = max(pause_text.get_width(), quit_text.get_width(), continue_text.get_width()) + 20
        rect_height = pause_text.get_height() + quit_text.get_height() + continue_text.get_height() + 80
        rect_x = 75 + SCREEN_WIDTH // 2 - rect_width // 2
        rect_y = SCREEN_HEIGHT // 3 - 9

        # Draw the gray background
        pygame.draw.rect(self.screen, (50, 50, 50), (rect_x, rect_y, rect_width, rect_height), border_radius=20)

        # Render and display the text on top of the background
        self.screen.blit(pause_text, (75 + SCREEN_WIDTH // 2 - pause_text.get_width() // 2, SCREEN_HEIGHT // 3 + 10))
        self.screen.blit(quit_text, (75 + SCREEN_WIDTH // 2 - quit_text.get_width() // 2, SCREEN_HEIGHT // 3 + 60))
        self.screen.blit(continue_text, (75 + SCREEN_WIDTH // 2 - continue_text.get_width() // 2, SCREEN_HEIGHT // 3 + 100))

    def run(self):
        drop_timer = 0
        while self.running:
            self.screen.fill(BLACK)
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_p:  # Pause the game
                        self.paused = not self.paused
                    elif self.paused:
                        if event.key == pygame.K_q:  # Quit from pause
                            self.running = False
                        elif event.key == pygame.K_c:  # Continue from pause
                            self.paused = False
                    else:
                        if event.key == pygame.K_LEFT and self.valid_move(self.current_tetromino, -1, 0):
                            self.current_tetromino.x -= 1
                        elif event.key == pygame.K_RIGHT and self.valid_move(self.current_tetromino, 1, 0):
                            self.current_tetromino.x += 1
                        elif event.key == pygame.K_DOWN and self.valid_move(self.current_tetromino, 0, 1):
                            self.current_tetromino.y += 1
                        elif event.key == pygame.K_UP:
                            self.current_tetromino.rotate()
                            if not self.valid_move(self.current_tetromino, 0, 0):
                                self.current_tetromino.rotate()
                                self.current_tetromino.rotate()
                                self.current_tetromino.rotate()
                        elif event.key == pygame.K_LSHIFT:
                            self.hold_current_tetromino()

            # Skip the game logic if paused
            if not self.paused:
                drop_timer += self.clock.get_rawtime()
                if drop_timer > 45:                                                         # Change drop speed here
                    if self.valid_move(self.current_tetromino, 0, 1):
                        self.current_tetromino.y += 1
                    else:
                        self.place_tetromino(self.current_tetromino)
                        self.clear_lines()
                        self.current_tetromino = self.next_tetrominos.pop(0)
                        self.next_tetrominos.append(self.generate_tetromino())
                        self.hold_used = False
                        if not self.valid_move(self.current_tetromino, 0, 0):
                            self.running = False
                    drop_timer = 0

            self.draw_grid()
            self.draw_tetromino(self.current_tetromino)
            self.draw_next_tetrominos()
            self.draw_hold_tetromino()
            self.draw_score()
            if self.paused:
                self.draw_pause_menu()
            pygame.display.flip()
            self.clock.tick(30)

        pygame.quit()

if __name__ == "__main__":
    game = TetrisGame()
    game.run()
    `,
    snaCode: `
import pygame
import random
import webcolors

# Initialize pygame
pygame.init()

# Screen dimensions
width = 600
height = 400

# Colors
white = (255, 255, 255)                         #sec_backround
black = (0, 0, 0)                               #snake body
red = webcolors.hex_to_rgb("#AA4D39")           #fail msgs
green = webcolors.hex_to_rgb("#297B48")         #food
blue = webcolors.hex_to_rgb("#2D4571")          #main_backround

# Snake settings
block_size = 10
snake_speed = 15

# Initialize game screen
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption('Snake Game')

# Clock
clock = pygame.time.Clock()

# Font styles
font_style = pygame.font.SysFont("bahnschrift", 25)
score_font = pygame.font.SysFont("comicsansms", 35)

def your_score(score):
    value = score_font.render("Your Score: " + str(score), True, green)
    screen.blit(value, [0, 0])

def our_snake(block_size, snake_list):
    for x in snake_list:
        pygame.draw.rect(screen, black, [x[0], x[1], block_size, block_size])

def message(msg, color):
    mesg = font_style.render(msg, True, color)
    screen.blit(mesg, [width / 6, height / 3])

def generate_food(snake_list, width, height, block_size):
    while True:
        foodx = round(random.randrange(0, width - block_size) / 10.0) * 10.0
        foody = round(random.randrange(0, height - block_size) / 10.0) * 10.0
        # Ensure food is not inside the snake
        if [foodx, foody] not in snake_list:
            return foodx, foody

def gameLoop():
    game_over = False
    game_close = False

    x1 = width / 2
    y1 = height / 2

    x1_change = 0
    y1_change = 0

    snake_List = []
    Length_of_snake = 1

    foodx, foody = generate_food(snake_List, width, height, block_size)

    while not game_over:

        while game_close == True:
            screen.fill(blue)
            message("Press Q-Quit or C-Play Again", red)
            your_score(Length_of_snake - 1)
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        game_over = True
                        game_close = False
                    if event.key == pygame.K_c:
                        gameLoop()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True
            if event.type == pygame.KEYDOWN:
                # Prevent snake from reversing direction
                if event.key == pygame.K_LEFT and x1_change == 0:
                    x1_change = -block_size
                    y1_change = 0
                elif event.key == pygame.K_RIGHT and x1_change == 0:
                    x1_change = block_size
                    y1_change = 0
                elif event.key == pygame.K_UP and y1_change == 0:
                    y1_change = -block_size
                    x1_change = 0
                elif event.key == pygame.K_DOWN and y1_change == 0:
                    y1_change = block_size
                    x1_change = 0

        if x1 >= width or x1 < 0 or y1 >= height or y1 < 0:
            game_close = True
        x1 += x1_change
        y1 += y1_change
        screen.fill(blue)
        pygame.draw.rect(screen, green, [foodx, foody, block_size, block_size])
        snake_Head = []
        snake_Head.append(x1)
        snake_Head.append(y1)
        snake_List.append(snake_Head)
        if len(snake_List) > Length_of_snake:
            del snake_List[0]

        for x in snake_List[:-1]:
            if x == snake_Head:
                game_close = True

        our_snake(block_size, snake_List)
        your_score(Length_of_snake - 1)

        pygame.display.update()

        if x1 == foodx and y1 == foody:
            foodx, foody = generate_food(snake_List, width, height, block_size)
            Length_of_snake += 1

        clock.tick(snake_speed)

    pygame.quit()
    quit()

gameLoop()
    `,
    tictaCode: `
import tkinter as tk
from tkinter import messagebox
import math

class TicTacToe:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("Tic Tac Toe")
        self.board = [[" " for _ in range(3)] for _ in range(3)]
        self.current_player = "X"
        self.ai_enabled = False
        self.buttons = [[None for _ in range(3)] for _ in range(3)]
        self.create_board()
        self.add_ai_toggle_button()

    def create_board(self):
        for row in range(3):
            for col in range(3):
                self.buttons[row][col] = tk.Button(
                    self.window,
                    text=" ",
                    font=("Arial", 24),
                    width=5,
                    height=2,
                    command=lambda r=row, c=col: self.make_move(r, c),
                )
                self.buttons[row][col].grid(row=row, column=col)

    def add_ai_toggle_button(self):
        toggle_button = tk.Button(
            self.window,
            text="Toggle AI",
            command=self.toggle_ai
        )
        toggle_button.grid(row=3, column=0, columnspan=3)

    def toggle_ai(self):
        self.ai_enabled = not self.ai_enabled
        messagebox.showinfo("AI Toggle", f"AI is now {'enabled' if self.ai_enabled else 'disabled'}.")
        if self.ai_enabled and self.current_player == "O":
            self.ai_move()

    def make_move(self, row, col):
        if self.board[row][col] == " " and not self.is_game_over():
            self.board[row][col] = self.current_player
            self.buttons[row][col].config(text=self.current_player)
            if self.check_winner(self.current_player):
                messagebox.showinfo("Game Over", f"{self.current_player} wins!")
                self.reset_board()
                return
            elif self.is_draw():
                messagebox.showinfo("Game Over", "It's a draw!")
                self.reset_board()
                return

            self.current_player = "O" if self.current_player == "X" else "X"

            if self.ai_enabled and self.current_player == "O":
                self.ai_move()

    def ai_move(self):
        best_score = -math.inf
        best_move = None

        for row in range(3):
            for col in range(3):
                if self.board[row][col] == " ":
                    self.board[row][col] = "O"
                    score = self.minimax(0, False)
                    self.board[row][col] = " "
                    if score > best_score:
                        best_score = score
                        best_move = (row, col)

        if best_move:
            row, col = best_move
            self.make_move(row, col)

    def minimax(self, depth, is_maximizing):
        if self.check_winner("O"):
            return 10 - depth
        elif self.check_winner("X"):
            return depth - 10
        elif self.is_draw():
            # Ensure draw logic accurately reflects the state of the board.
            return 0

        if is_maximizing:
            best_score = -math.inf
            for row in range(3):
                for col in range(3):
                    if self.board[row][col] == " ":
                        self.board[row][col] = "O"
                        score = self.minimax(depth + 1, False)
                        self.board[row][col] = " "
                        best_score = max(score, best_score)
            return best_score
        else:
            best_score = math.inf
            for row in range(3):
                for col in range(3):
                    if self.board[row][col] == " ":
                        self.board[row][col] = "X"
                        score = self.minimax(depth + 1, True)
                        self.board[row][col] = " "
                        best_score = min(score, best_score)
            return best_score

    def check_winner(self, player):
        for row in self.board:
            if all(cell == player for cell in row):
                return True
        for col in range(3):
            if all(self.board[row][col] == player for row in range(3)):
                return True
        if all(self.board[i][i] == player for i in range(3)) or all(self.board[i][2 - i] == player for i in range(3)):
            return True
        return False

    def is_draw(self):
        # Ensure draw logic reflects that there are no available moves.
        return all(cell != " " for row in self.board for cell in row) and not self.check_winner("X") and not self.check_winner("O")

    def is_game_over(self):
        return self.check_winner("X") or self.check_winner("O") or self.is_draw()

    def reset_board(self):
        self.board = [[" " for _ in range(3)] for _ in range(3)]
        self.current_player = "X"
        for row in range(3):
            for col in range(3):
                self.buttons[row][col].config(text=" ")

    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    game = TicTacToe()
    game.run()
`,
    calCode: `
import tkinter as tk
from tkinter import messagebox

def calculate():
    try:
        num1 = float(entry1.get())
        operator = operator_var.get()
        num2 = float(entry2.get())
        
        if operator == '+':
            result = num1 + num2
        elif operator == '-':
            result = num1 - num2
        elif operator == '*':
            result = num1 * num2
        elif operator == '/':
            if num2 == 0:
                messagebox.showerror("Error", "Division by zero is not allowed.")
                return
            result = num1 / num2
        else:
            messagebox.showerror("Error", "Invalid operator.")
            return
        
        result_label.config(text=f"Result: {result}")
    except ValueError:
        messagebox.showerror("Error", "Please enter valid numbers.")

# Create the main window
root = tk.Tk()
root.title("Simple Calculator")

# Entry fields for numbers
tk.Label(root, text="Number 1:").grid(row=0, column=0, padx=10, pady=5)
entry1 = tk.Entry(root)
entry1.grid(row=0, column=1, padx=10, pady=5)

tk.Label(root, text="Operator:").grid(row=1, column=0, padx=10, pady=5)
operator_var = tk.StringVar(value='+')
operator_menu = tk.OptionMenu(root, operator_var, '+', '-', '*', '/')
operator_menu.grid(row=1, column=1, padx=10, pady=5)

tk.Label(root, text="Number 2:").grid(row=2, column=0, padx=10, pady=5)
entry2 = tk.Entry(root)
entry2.grid(row=2, column=1, padx=10, pady=5)

# Button to calculate
calc_button = tk.Button(root, text="Calculate", command=calculate)
calc_button.grid(row=3, column=0, columnspan=2, pady=10)

# Label to display result
result_label = tk.Label(root, text="Result: ")
result_label.grid(row=4, column=0, columnspan=2, pady=10)

# Start the GUI event loop
root.mainloop()
`,
  };
  
  function showCode(codeKey) {
    const modal = document.getElementById("codeModal");
    const codeDisplay = document.getElementById("modalCode");
    codeDisplay.textContent = codeSnippets[codeKey];
    modal.style.display = "flex";
    document.body.style.overflow = 'hidden';
  }

  function showCode(codeKey) {
    const modal = document.getElementById("codeModal");
    const codeDisplay = document.getElementById("modalCode");
    codeDisplay.textContent = codeSnippets[codeKey];
    modal.style.display = "flex";
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    document.getElementById("codeModal").style.display = "none";
    document.body.style.overflow = '';
  }

  