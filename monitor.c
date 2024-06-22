#include <stdio.h>
#include <stdlib.h>
#include <libudev.h>
#include <unistd.h>
#include <sys/select.h>
#include <time.h>

#define UPDATE_INTERVAL_SEC 1
#define UPDATE_INTERVAL_USEC 625000

void monitor_usb_ports()
{
    struct udev *udev;
    struct udev_monitor *mon;
    int fd;

    udev = udev_new();
    if (!udev)
    {
        fprintf(stderr, "Failed to create udev\n");
        return;
    }
    mon = udev_monitor_new_from_netlink(udev, "udev");
    udev_monitor_filter_add_match_subsystem_devtype(mon, "usb", NULL);
    udev_monitor_enable_receiving(mon);

    fd = udev_monitor_get_fd(mon);

    FILE *file = fopen("usb_events.txt", "w");
    if (!file)
    {
        fprintf(stderr, "Failed to open file for writing\n");
        return;
    }

    struct timeval timeout;
    timeout.tv_sec = UPDATE_INTERVAL_SEC;
    timeout.tv_usec = UPDATE_INTERVAL_USEC;

    while (1)
    {
        fd_set fds;
        FD_ZERO(&fds);
        FD_SET(fd, &fds);

        if (select(fd + 1, &fds, NULL, NULL, &timeout) > 0 && FD_ISSET(fd, &fds))
        {
            struct udev_device *dev = udev_monitor_receive_device(mon);
            if (dev)
            {
                time_t now = time(NULL);
                fprintf(file, "%s_%s", udev_device_get_action(dev), ctime(&now));
                fflush(file);
                udev_device_unref(dev);
            }
        }

        timeout.tv_sec = UPDATE_INTERVAL_SEC;
        timeout.tv_usec = UPDATE_INTERVAL_USEC;
    }

    fclose(file);
    udev_monitor_unref(mon);
    udev_unref(udev);
}

int main()
{
    monitor_usb_ports();
    return 0;
}
