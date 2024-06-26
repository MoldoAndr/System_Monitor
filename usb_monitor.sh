while true; do

    old_usb_list=$(lsusb)
    sleep 1
    new_usb_list=$(lsusb)

done
