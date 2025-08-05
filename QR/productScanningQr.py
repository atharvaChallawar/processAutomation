import tkinter as tk
from tkinter import messagebox
import qrcode
import json
from PIL import ImageTk, Image
from pymongo import MongoClient


client = MongoClient("mongodb+srv://atharva:1234@trade.jxgjfnq.mongodb.net/?retryWrites=true&w=majority&appName=trade")  
db = client["test"]
collection = db["items"]


def get_weight():
    product = collection.find_one({"productId": "P101"})
    if product:
        weight = product.get("weight", 0)
        try:
            weight_grams = float(weight) / 1000  # Multiply by 1000
            weight_entry.delete(0, tk.END)
            weight_entry.insert(0, str(weight_grams))
        except ValueError:
            messagebox.showerror("Error", "Invalid weight format in database.")
    else:
        messagebox.showerror("Error", "Product not found in database.")

# Function to generate QR
def generate_qr():
    pid = product_id_entry.get().strip()
    pname = product_name_entry.get().strip()
    quantity_input = quantity_entry.get().strip()
    weight_input = weight_entry.get().strip()

    if not pid or not pname or not quantity_input or not weight_input:
        messagebox.showerror("Error", "All fields are required.")
        return

    try:
        quantity = int(quantity_input)
        weight = float(weight_input)
    except ValueError:
        messagebox.showerror("Error", "Quantity must be an integer and Weight must be a number.")
        return

    product_data = {
        "productId": pid,
        "productName": pname,
        "quantity": quantity,
        "weight": weight
    }

    qr_data = json.dumps(product_data)

    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save("product_qr.png")

    img = Image.open("product_qr.png")
    img = img.resize((200, 200))
    qr_image = ImageTk.PhotoImage(img)

    qr_label.config(image=qr_image)
    qr_label.image = qr_image

    messagebox.showinfo("Success", f"QR Code generated for {pname}!")

# GUI Setup
root = tk.Tk()
root.title("Product QR Generator")
root.geometry("400x650")
root.resizable(False, False)

tk.Label(root, text="Enter Product Details", font=("Arial", 14)).pack(pady=10)

tk.Label(root, text="Product ID:").pack()
product_id_entry = tk.Entry(root, width=30)
product_id_entry.pack()

tk.Label(root, text="Product Name:").pack()
product_name_entry = tk.Entry(root, width=30)
product_name_entry.pack()

tk.Label(root, text="Quantity:").pack()
quantity_entry = tk.Entry(root, width=30)
quantity_entry.pack()

tk.Label(root, text="Weight (g):").pack()
weight_entry = tk.Entry(root, width=30)
weight_entry.pack()

# Buttons
tk.Button(root, text="Refresh Weight", command=get_weight, bg="orange", fg="black", font=("Arial", 10)).pack(pady=5)
tk.Button(root, text="Generate QR Code", command=generate_qr, bg="green", fg="white", font=("Arial", 12)).pack(pady=10)

qr_label = tk.Label(root)
qr_label.pack(pady=10)

root.mainloop()
