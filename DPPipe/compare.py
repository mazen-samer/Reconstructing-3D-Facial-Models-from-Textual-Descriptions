from deepface import DeepFace


def get_imgs(img_name: str):
    img_folder_path = "../server/static/imgs"
    generated_folder_path = "../server/static/generated"
    dfs = DeepFace.find(
        img_path=f"{generated_folder_path}/{img_name}",
        db_path=img_folder_path,
        enforce_detection=False,
    )
    return list(dfs[0].identity.str.split("/").str[-1])


def main():
    print(get_imgs("generated-1-1.png"))


if __name__ == "__main__":
    main()
