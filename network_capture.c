#include <stdio.h>
#include <unistd.h>
#include <string.h>

#define INTERVAL_MICROSECONDS 222222
#define OUTPUT_FILE "network_usage"

void get_net_stats(unsigned long long *recv_bytes, unsigned long long *trans_bytes)
{
    FILE *fp;
    char line[256];
    char interface_name[256];
    char interface_name2[256];
    unsigned long long recv, transmit;

    FILE *int_erface = fopen("net_int", "r");
    fscanf(int_erface, "%s\n", interface_name2);
    fclose(int_erface);

    fp = fopen("/proc/net/dev", "r");
    if (fp == NULL)
    {
        perror("Error opening /proc/net/dev");
        return;
    }

    while (fgets(line, sizeof(line), fp))
    {
        if (sscanf(line, "%s %llu %*u %*u %*u %*u %*u %*u %*u %llu", interface_name, &recv, &transmit) == 3 &&
            strncmp(interface_name, interface_name2, strlen(interface_name2)) == 0)
        {
            *recv_bytes = recv;
            *trans_bytes = transmit;
            break;
        }
    }

    fclose(fp);
}

int main()
{
    long long recv_bytes_last = 0, trans_bytes_last = 0;
    long long recv_bytes_current, trans_bytes_current;
    long long recv_bytes_diff, trans_bytes_diff;
    FILE *output_file;

    while (1)
    {
        output_file = fopen(OUTPUT_FILE, "w");
        if (output_file == NULL)
        {
            perror("Error opening output file");
            return 1;
        }

        get_net_stats(&recv_bytes_current, &trans_bytes_current);

        recv_bytes_diff = recv_bytes_current - recv_bytes_last;
        trans_bytes_diff = trans_bytes_current - trans_bytes_last;

        if (recv_bytes_diff >= 0 && trans_bytes_diff >= 0)
        {
            recv_bytes_last = recv_bytes_current;
            trans_bytes_last = trans_bytes_current;
        }

        fprintf(output_file, "%lluB ", recv_bytes_diff);
        fprintf(output_file, "%lluB\n", trans_bytes_diff);
        fclose(output_file);
        usleep(INTERVAL_MICROSECONDS);
    }

    return 0;
}
