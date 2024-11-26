from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import chromedriver_binary
import os
import time
import datetime
from pathlib import Path

def get_download_dir():
    dl_name = "download"
    dl_path = Path(dl_name)
    dl_path.mkdir(exist_ok=True)
    dl_dir = str(dl_path.resolve())
    return dl_dir

def get_file_path(dl_dir, file_name, extension):
    return f"{dl_dir}\\{file_name}{extension}"

def get_rename_file_name(dl_dir, file_name, extension):
    full_path = get_file_path(dl_dir, file_name, extension)
    t = os.path.getmtime(full_path)
    dt = datetime.datetime.fromtimestamp(t)
    return f"{dl_dir}\\{file_name}{dt.strftime("%Y%m%d%H%M%S")}{extension}"


def initializeOption(dl_dir):
    options = webdriver.ChromeOptions()
    options.add_experimental_option("prefs", {
        "download.default_directory": dl_dir
    })
    return options

def scrape():
    pokemon_name = "フシギダネ"
    subskill1 = "食材確率アップM"
    subskill2 = "食材確率アップS"
    subskill3 = "おてつだいボーナス"
    personality = "れいせい"

    dl_dir = get_download_dir()

    driver = webdriver.Chrome(options=initializeOption(dl_dir))
    driver.implicitly_wait(3)
    driver.get("https://www.pokemonsleepdaifuku.com/checker/")
    time.sleep(5)
    
    # ポケモン名
    scroll(driver, "/html/body/main/article/div/form/div[4]")
    print("ポケモン名入力")
    setPullDown(driver, xpath="/html/body/main/article/div/form/div[1]/div[2]/div[1]/div/span/span[1]/span/span[1]", value=pokemon_name)

    # レベル
    # print("レベル入力")
    # driver.find_element(By.XPATH, "/html/body/main/article/div/form/div[1]/div[2]/div[2]/input[4]").click()
    # time.sleep(3)

    scroll(driver, "/html/body/main/article/div/form/div[6]")
    # スキル1～3
    print("スキル1入力")
    setPullDown(driver, xpath="/html/body/main/article/div/form/div[5]/div[2]/div[1]/div/span/span[1]/span/span[1]", value=subskill1)

    print("スキル2入力")
    setPullDown(driver, xpath="/html/body/main/article/div/form/div[5]/div[2]/div[2]/div/span/span[1]/span/span[1]", value=subskill2)

    # print("スキル3入力")
    # setPullDown(driver, xpath="/html/body/main/article/div/form/div[5]/div[2]/div[2]/div/span/span[1]/span/span[1]", value=subskill3)

    scroll(driver, "/html/body/main/article/div/div[3]")
    print("性格入力")
    setPullDown(driver, xpath="/html/body/main/article/div/form/div[6]/div[2]/div/div/span/span[1]/span/span[1]", value=personality)

    print("チェック")
    driver.find_element(By.CLASS_NAME, "submitButton").click()
    time.sleep(5)

    print("結果")
    driver.find_element(By.XPATH, "/html/body/main/article/div/div[3]/div/div/table/tbody/tr[2]/td[15]/button").click()
    time.sleep(10)

    print("ダウンロード")
    scroll(driver, "/html/body/main/div/div[3]")
    driver.find_element(By.ID, "capture").click()
    time.sleep(5)

    file_name = "pokemon_checked"
    extension = ".png"
    before_path = get_file_path(dl_dir, file_name, extension)
    after_path = get_rename_file_name(dl_dir, file_name, extension)
    print(f"変更前：{before_path}")
    print(f"変更後：{after_path}")
    os.rename(before_path, after_path)

    return {
        "input": {
            "pokemon_name": pokemon_name,
            "subskill1": subskill1,
            "subskill2": subskill2,
            "subskill3": subskill3,
            "personality": personality
        },
        "output": {
            "image_path": after_path
        }
    }

def scroll(driver, xpath):
    element = driver.find_element(By.XPATH, xpath)
    driver.execute_script("arguments[0].scrollIntoView(false);", element)

def setPullDown(driver, xpath, value):
    driver.find_element(By.XPATH, xpath).click()
    time.sleep(3)
    element = driver.find_element(By.CLASS_NAME, "select2-search__field")
    element.send_keys(value)
    time.sleep(1)
    element.send_keys(Keys.ENTER)
    time.sleep(1)

if __name__ == "__main__":
    scrape()
