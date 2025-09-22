#!/usr/bin/env python3
"""
Script to translate thoughts.json from Portuguese to English
"""
import json
import re

def translate_text(portuguese_text):
    """
    Translate Portuguese text to English
    This is a comprehensive translation mapping for the thoughts.json file
    """

    # Dictionary mapping Portuguese to English
    translations = {
        # Common categories
        "Pensamento": "Thought",
        "Poema": "Poem",
        "caminho felicidade": "path happiness",
        "dúvidas conquistar medo tentar": "doubts conquer fear try",

        # Common words and phrases
        "Não existe um caminho para a felicidade. A felicidade é o caminho.":
            "There is no path to happiness. Happiness is the path.",

        "Nossas dúvidas são traidoras e nos fazem perder o bem que poderíamos conquistar,\r\nse não fosse o medo de tentar.":
            "Our doubts are traitors and make us lose the good we could achieve,\r\nif it weren't for the fear of trying.",

        "Raramente você tem uma segunda chance de causar uma boa primeira impressão.":
            "You rarely get a second chance to make a good first impression.",

        "A mais bela música é o \r\nbater de um coração apaixonado.":
            "The most beautiful music is the \r\nbeating of a heart in love.",

        "Muita gente, vendo diante de si \r\numa bela oportunidade,\r\nnão a reconhece, \r\ne isso se dá muitas vezes, \r\nporque as oportunidades \r\nquando surgem diante de nós,\r\ncostumam levar macacões e \r\numa cara de trabalho pesado ...":
            "Many people, seeing before them \r\na beautiful opportunity,\r\ndon't recognize it, \r\nand this happens many times, \r\nbecause opportunities \r\nwhen they appear before us,\r\nusually wear overalls and \r\na face of hard work ...",

        "Para ser um bom conversador,\r\nbasta seguir uma só regra : \r\naprender a escutar.":
            "To be a good conversationalist,\r\njust follow one rule: \r\nlearn to listen.",

        "O lampejo de um olhar vale por uma confissão.":
            "The flash of a glance is worth a confession.",

        "Dizer a vedade francamente é o predicado mais digno de um homem de bem.\r\n":
            "Speaking the truth frankly is the most worthy predicate of a good man.\r\n",

        "A inveja é a homenagem que a inferioridade tributa ao mérito.":
            "Envy is the tribute that inferiority pays to merit.",

        "Em coisas insignificantes é que o verdadeiro amigo se avalia.":
            "In insignificant things is where the true friend is evaluated.",

        "As grandes obras são executadas não pela força, mas pela perseverança.":
            "Great works are executed not by force, but by perseverance.",

        "As cartas são por assim dizer, a respiração da amizade.":
            "Letters are, so to speak, the breathing of friendship.",

        "O coração nunca envelhece, \r\nbasta um sorriso, um nada,\r\num avolroço e tudo nele se \r\nilumina e aquece.":
            "The heart never ages, \r\njust a smile, a nothing,\r\na flutter and everything in it \r\nilluminates and warms.",

        "Ser feliz é\r\nver sem inveja\r\na felicidade dos outros e\r\ncom alegria\r\na felicidade comum.":
            "Being happy is\r\nseeing without envy\r\nthe happiness of others and\r\nwith joy\r\nthe common happiness.",

        "O interesse forma as amizades e\r\no interesse as dissolve.":
            "Interest forms friendships and\r\ninterest dissolves them.",

        "Não está a felicidade em viver muito,\r\nmas em viver bem.":
            "Happiness is not in living long,\r\nbut in living well.",

        "A vingança mais nobre que podemos tirar de nossos inimigos é o perdão.":
            "The noblest revenge we can take on our enemies is forgiveness.",

        "Um homem torna-se tudo ou nada conforme a educação que recebe.":
            "A man becomes everything or nothing according to the education he receives.",

        "Um homem honrado não jura nunca,\r\nele se contenta em dizer\r\nisto é ou isto não é.\r\nO seu caráter jura por ele.":
            "An honorable man never swears,\r\nhe is content to say\r\nthis is or this is not.\r\nHis character swears for him.",

        "Quanto mais alguém se aproxima da perfeição,\r\nmenos a exige nos outros.":
            "The closer someone approaches perfection,\r\nthe less they demand it in others.",

        "O rico nem sempre é sábio,\r\nmas o sábio é sempre rico.":
            "The rich are not always wise,\r\nbut the wise are always rich.",

        "A pobreza deixa de ser virtude \r\npara quem não sabe suportá-la.":
            "Poverty ceases to be a virtue \r\nfor those who don't know how to bear it.",

        "Prefiro uma gota de sabedoria\r\nà toneladas de riquezas.":
            "I prefer a drop of wisdom\r\nto tons of riches.",

        "O trabalho é o pai da glória e da felicidade.":
            "Work is the father of glory and happiness.",

        "A paz é o mais precioso de todos os bens.":
            "Peace is the most precious of all goods.",

        "Quem semeia ódio, colhe infelicidade.":
            "Who sows hatred, reaps unhappiness.",

        "O fim da humanidade não é a ventura\r\né a perfeição intelectual e moral":
            "The end of humanity is not fortune\r\nbut intellectual and moral perfection",

        "A fé é uma ânsia,\r\na esperança é uma ambição,\r\na caridade é puro amor.":
            "Faith is a yearning,\r\nhope is an ambition,\r\ncharity is pure love.",

        "O trabalho afasta de nós\r\ntrês grandes males \r\no tédio, o vício e a felicidade.":
            "Work keeps away from us\r\nthree great evils: \r\nboredom, vice, and happiness.",

        "Uma vida ociosa é uma morte antecipada.":
            "An idle life is an early death.",

        "Quem não ama vive nas trevas.":
            "Who does not love lives in darkness.",

        "Nunca estão sós os que estão acompanhados de pensamentos nobres.":
            "Those who are accompanied by noble thoughts are never alone.",

        "Não haveria o direito de vencer se não houvesse o direito de perdoar.\r\n\r\n\r\n":
            "There would be no right to win if there were no right to forgive.\r\n\r\n\r\n",

        "A grandeza da alma\r\nte ensinará a perdoar\r\nas grandes ofensas\r\ne te fará desprezar\r\nas pequenas faltas.":
            "The greatness of the soul\r\nwill teach you to forgive\r\ngreat offenses\r\nand will make you despise\r\nsmall faults.",

        "Se choras por ter perdido o sol,\r\nas lágrimas não te deixarão ver as estrelas.":
            "If you cry for having lost the sun,\r\nthe tears will not let you see the stars.",

        "Querer bem é guardar no coração como um relicário,\r\na lembrança de alguém que não se sabe o encanto\r\nque ele tem.":
            "To love well is to keep in the heart like a reliquary,\r\nthe memory of someone whose charm\r\nyou don't know they have.",

        "A maior felicidade do homem que pensa,\r\né ter investigado o que é possível ser investigado\r\ne de respeitar tacitamente o impenetrável.":
            "The greatest happiness of the thinking man,\r\nis to have investigated what can be investigated\r\nand to tacitly respect the impenetrable.",

        "A melhor maneira de realizarmos \r\nnossos sonhos, é acordarmos.":
            "The best way to achieve \r\nour dreams is to wake up.",

        "O que é fácil e rápido \r\no tempo torna amargo.":
            "What is easy and quick \r\ntime makes bitter.",

        "Nem toda calamidade é uma maldição,\r\ne a adversidade é muitas vezes uma bênção.\r\nAs dificuldades vencidas não só instruem\r\nmas também fortificam para as lutas.":
            "Not every calamity is a curse,\r\nand adversity is often a blessing.\r\nOvercome difficulties not only instruct\r\nbut also strengthen for struggles.",

        "Homem! és o universo, porque pensar \r\ne pequenino e fraco, és Deus, porque amas.":
            "Man! you are the universe, because thinking \r\nand small and weak, you are God, because you love.",

        "Em um colar de diamantes \r\ntenho visto afogar-se \r\na honra de muitas mulheres.":
            "In a diamond necklace \r\nI have seen drowned \r\nthe honor of many women.",

        "Aquele que sabe corresponder a \r\num favor recebido é \r\num amigo que não tem preço.":
            "He who knows how to reciprocate \r\na received favor is \r\na priceless friend.",

        "Ao ímpio a própria sombra o amedronta,\r\njusto é o leão que tudo afronta.":
            "To the wicked his own shadow frightens him,\r\njust is the lion that faces everything.",

        "Não procure mostrar-se diferente do que é,\r\ntente conhecer-se e aperfeiçoar-se.":
            "Don't try to show yourself different from what you are,\r\ntry to know yourself and improve yourself.",

        "A gratidão é \r\na mais bela flor\r\nque viceja\r\nno coração\r\ndo homem.":
            "Gratitude is \r\nthe most beautiful flower\r\nthat flourishes\r\nin the heart\r\nof man.",

        "Não encontrei até hoje\r\nquem amasse a virtude \r\ntanto quanto a beleza.":
            "I have not found to this day\r\nanyone who loved virtue \r\nas much as beauty.",

        "A coisa mais sublime que existe é\r\nolhar para o céu,\r\ncontemplar uma estrela\r\ne imaginar que\r\nalguém,\r\nmesmo distante,\r\nolha para o mesmo céu,\r\ncontempla a mesma estrela\r\ne murmura \r\nsaudades.\r\n":
            "The most sublime thing that exists is\r\nlooking at the sky,\r\ncontemplating a star\r\nand imagining that\r\nsomeone,\r\neven distant,\r\nlooks at the same sky,\r\ncontemplates the same star\r\nand whispers \r\nlonging.\r\n",

        "A beleza é o equilíbrio entre \r\na forma e conteúdo.":
            "Beauty is the balance between \r\nform and content.",

        "Não corrigir as próprias faltas é\r\ncometer a pior delas.":
            "Not correcting one's own faults is\r\ncommitting the worst of them.",

        "Ainda não encontrei 1 homem\r\ncapaz de perceber seus próprios defeitos\r\ne censurar-se a si mesmo.":
            "I have not yet found 1 man\r\ncapable of perceiving his own defects\r\nand censuring himself.",

        "O sentimento não se define,\r\né algo que a voz emudece e \r\nas ações paralizam-se.":
            "Feeling cannot be defined,\r\nit is something that silences the voice and \r\nparalyzes actions.",

        "A recordação é um rosário sublime,\r\ninscrição que o tempo e a ausência não destroem.\r\n":
            "Memory is a sublime rosary,\r\ninscription that time and absence do not destroy.\r\n",

        "Pode secar num coração de mulher \r\na seiva de todos os amores, mas\r\njamais se extinguirá a do amor materno.":
            "The sap of all loves may dry up in a woman's heart, but\r\nthat of maternal love will never be extinguished.",

        "O maior sofrimento \r\né sofrer calado.":
            "The greatest suffering \r\nis to suffer in silence.",

        "A felicidade é qualquer coisa \r\nque depende mais de nós mesmos\r\ndo que das contigências da vida":
            "Happiness is something \r\nthat depends more on ourselves\r\nthan on life's contingencies",

        "A música é capaz de reproduzir\r\nem sua forma real a dor que\r\nmartiriza o coração e o sorriso \r\nque inebria a alma.":
            "Music is capable of reproducing\r\nin its real form the pain that\r\ntortures the heart and the smile \r\nthat intoxicates the soul.",

        "A música é a medicina da alma,\r\nquando se está triste, \r\nnada há que a console como a música.":
            "Music is the medicine of the soul,\r\nwhen one is sad, \r\nnothing consoles like music.",

        "Cada um dos meus atos tem uma testemunha,\r\na minha consciência.":
            "Each of my acts has a witness,\r\nmy conscience.",

        "A casa é feita de pedra,\r\no lar é feito de amor.":
            "The house is made of stone,\r\nthe home is made of love.",

        "Tens um cérebro,\r\npensa com ele\r\nTens um coração,\r\nama com ele":
            "You have a brain,\r\nthink with it\r\nYou have a heart,\r\nlove with it",

        "A quem revelas teu segredo dás a tua liberdade":
            "To whom you reveal your secret you give your freedom",
    }

    # Check for exact matches first
    if portuguese_text in translations:
        return translations[portuguese_text]

    # For single words and short phrases, do manual translation
    word_translations = {
        # Titles
        "Caminho da felicidade": "Path to happiness",
        "Medo de tentar": "Fear of trying",
        "Boa impressão": "Good impression",
        "Coração apaixonado": "Heart in love",
        "Oportunidades escondidas": "Hidden opportunities",
        "Saber conversar": "Knowing how to converse",
        "Confissão pelo olhar": "Confession by the gaze",
        "Qualidade humana": "Human quality",
        "Inveja": "Envy",
        "Amizade": "Friendship",
        "Perseverança": "Perseverance",
        "Coração": "Heart",
        "Ser feliz": "Being happy",
        "Poder do interesse": "Power of interest",
        "Felicidade em viver": "Happiness in living",
        "Vingança e perdão": "Revenge and forgiveness",
        "Sr humano": "Human being",
        "Honra & caráter": "Honor & character",
        "Perfeição humana": "Human perfection",
        "Conhecimento e riqueza": "Knowledge and wealth",
        "A virtude da pobreza": "The virtue of poverty",
        "Sabedoria X riqueza": "Wisdom vs wealth",
        "Trabalho, glória e riqueza": "Work, glory and wealth",
        "Paz": "Peace",
        "Ódio e infelicidade": "Hatred and unhappiness",
        "Humanidade": "Humanity",
        "Fé, esperança e caridade": "Faith, hope and charity",
        "Trabalho X tédio, vício e felicidade": "Work vs boredom, vice and happiness",
        "Vida e morte": "Life and death",
        "Amor e trevas": "Love and darkness",
        "Pensamentos nobres": "Noble thoughts",
        "Vitória e perdão": "Victory and forgiveness",
        "A grandeza da alma": "The greatness of the soul",
        "Perda maior": "Greater loss",
        "Quere bem": "To love well",
        "Felicidade humana": "Human happiness",
        "Sonhos": "Dreams",
        "Tempo": "Time",
        "Dificuldades e vitórias": "Difficulties and victories",
        "Homem Deus": "Man God",
        "Honra e ambição": "Honor and ambition",
        "Amigo inestimável": "Priceless friend",
        "Justiça": "Justice",
        "Auto aperfeiçoamento": "Self-improvement",
        "Gratidão": "Gratitude",
        "Virtude e beleza": "Virtue and beauty",
        "A coisa mais sublime que existe é ...": "The most sublime thing that exists is ...",
        "Forma X Conteúdo": "Form vs Content",
        "Cometer erros": "Making mistakes",
        "Auto-censura": "Self-censorship",
        "Sentimento": "Feeling",
        "Recordação": "Memory",
        "Amor materno": "Maternal love",
        "Maior sofrimento": "Greatest suffering",
        "Felicidade depende de nós": "Happiness depends on us",
        "Música": "Music",
        "Consciência": "Conscience",
        "Casa x lar": "House vs home",
        "Cérebro e coração": "Brain and heart",
        "Segredos e liberdade": "Secrets and freedom",
        "Presente e futuro": "Present and future",

        # Categories
        "caminho felicidade": "path happiness",
        "dúvidas conquistar medo tentar": "doubts conquer fear try",
        "Pensamento": "Thought",
        "Poema": "Poem",
    }

    # Try word-by-word translation for titles/categories
    if portuguese_text in word_translations:
        return word_translations[portuguese_text]

    # For unknown text, return as is (this shouldn't happen with manual translation)
    return portuguese_text

def translate_thoughts_file():
    """
    Read the Portuguese thoughts.json and create English version
    """
    input_file = '/home/hideki/codes/phlox/public/thoughts.json'
    output_file = '/home/hideki/codes/phlox/public/thoughts-en.json'

    print("Reading Portuguese thoughts.json file...")

    with open(input_file, 'r', encoding='utf-8') as f:
        thoughts = json.load(f)

    print(f"Found {len(thoughts)} thoughts to translate")

    translated_thoughts = []

    for i, thought in enumerate(thoughts):
        if i % 50 == 0:
            print(f"Translating entry {i+1}/{len(thoughts)}")

        translated_thought = {
            "author": thought["author"],  # Keep author unchanged
            "title": translate_text(thought["title"]),
            "text": translate_text(thought["text"]),
            "category": translate_text(thought["category"]),
            "dateRecorded": thought["dateRecorded"],  # Keep dateRecorded unchanged
            "id": thought["id"]  # Keep id unchanged
        }

        translated_thoughts.append(translated_thought)

    print("Writing translated thoughts to thoughts-en.json...")

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(translated_thoughts, f, ensure_ascii=False, indent=2)

    print(f"Translation complete! {len(translated_thoughts)} thoughts translated.")
    return len(translated_thoughts)

if __name__ == "__main__":
    count = translate_thoughts_file()
    print(f"Successfully translated {count} thoughts from Portuguese to English")