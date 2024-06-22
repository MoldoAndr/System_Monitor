#include <stdio.h>
#include <unistd.h>
#include <proc/readproc.h>

#define MAX_LINES 10

void check_proc()
{
    FILE *file = fopen("procs", "w+");
    if (!file)
    {
        perror("Error opening file");
        return;
    }

    PROCTAB *proc = openproc(PROC_FILLSTAT | PROC_FILLSTATUS);
    if (!proc)
    {
        perror("openproc");
        fclose(file);
        return;
    }

    proc_t proc_info;
    int count = 0;

    fseek(file, 0, SEEK_SET);

    int lines_in_file = 0;
    while (fgets(NULL, 0, file))
    {
        lines_in_file++;
    }

    int lines_to_skip = lines_in_file - MAX_LINES;
    if (lines_to_skip < 0)
    {
        lines_to_skip = 0;
    }

    fseek(file, 0, SEEK_SET);

    for (int i = 0; i < lines_to_skip; ++i)
    {
        if (!fgets(NULL, 0, file))
        {
            break;
        }
    }
    while (readproc(proc, &proc_info) != NULL && count < 10)
    {
        if (proc_info.utime != 0 && proc_info.rss != 0)
        {
            double cpu_usage = 100.0 * proc_info.utime / proc_info.rss;
            if (cpu_usage == cpu_usage)
            {
                fprintf(file, "%d %.2f%% %s\n",
                        proc_info.tid,
                        cpu_usage,
                        proc_info.cmd);
                count++;
            }
        }
    }

    fclose(file);
    closeproc(proc);
}

int main()
{
    check_proc();
    return 0;
}
