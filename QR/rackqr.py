import tkinter as tk
from tkinter import messagebox
import qrcode
import json
from PIL import Image, ImageTk

def generate_rack_qr():
    rack_id = rack_id_entry.get().strip()

    if not rack_id:
        messagebox.showerror("Error", "Please enter a Rack ID.")
        return

    rack_data = {
        "rackId": rack_id
    }

    qr_data = json.dumps(rack_data)

    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save("rack_qr.png")

    img = Image.open("rack_qr.png")
    img = img.resize((200, 200))
    qr_image = ImageTk.PhotoImage(img)

    qr_label.config(image=qr_image)
    qr_label.image = qr_image

    messagebox.showinfo("Success", f"QR Code saved as rack_qr.png")

# GUI setup
root = tk.Tk()
root.title("Rack QR Generator")
root.geometry("400x400")
root.resizable(False, False)

tk.Label(root, text="Enter Rack ID", font=("Arial", 14)).pack(pady=10)

rack_id_entry = tk.Entry(root, width=30)
rack_id_entry.pack(pady=5)

tk.Button(root, text="Generate QR Code", command=generate_rack_qr, bg="blue", fg="white", font=("Arial", 12)).pack(pady=10)

qr_label = tk.Label(root)
qr_label.pack(pady=10)

root.mainloop()
