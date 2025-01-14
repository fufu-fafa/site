// Code snippets for projects
const codeSnippets = {
    snakeCode: `
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
    `
  };
  
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
  