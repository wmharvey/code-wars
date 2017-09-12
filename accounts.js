function updateAccounts(accounts, logons) {
  const accountsArr = accounts["Accounts"];
  const logonsArr = logons["Logons"];

  const newAccounts = logonsArr.reduce((acc, logon) => {
    const oldAccount = isAlreadyInAccounts(logon, accountsArr);
     if (oldAccount) {
        oldAccount.LogonCount++;
        if (logon.Date > oldAccount.LastLogon) {
          oldAccount.LastLogon = logon.Date;
          if (logon.Name) {
            oldAccount.Name = logon.Name;
          }
        }
        const position = getIndexIfInAccumulator(acc, oldAccount);
        if (position > -1) {
          acc[position] = oldAccount;
        } else {
          acc.push(oldAccount);
        }
      } else {
        const position = getIndexIfInAccumulator(acc, logon);
        if (position > -1) {
          let oldCount = acc[position].LogonCount;
          const incremented = oldCount + 1;

          if (logon.Date < acc[position].LastLogon) {
            logon.LastLogon = acc[position].LastLogon;
          } else {
            logon.LastLogon = logon.Date;
          }

          acc[position] = logon;
          acc[position].LogonCount = incremented;
        } else {
          logon.LogonCount = 1;
          logon.LastLogon = logon.Date;
          acc.push(logon);
        }
      }
      return acc;
  }, []);

  const combinedAccounts = combineAccounts(accountsArr, newAccounts);

  const sorted = combinedAccounts.sort((a, b) => {
    return a.Id - b.Id;
  });

  return {
    "Accounts": sorted
  }
}

function isAlreadyInAccounts(account, accountsArr) {
  return accountsArr.find(element => {
    return element.Id === account.Id;
  });
}

function getIndexIfInAccumulator(accumulator, account) {
  const oldElement = isAlreadyInAccounts(account, accumulator);
  return accumulator.indexOf(oldElement);
}

function combineAccounts(oldAccounts, newAccounts) {
  oldAccounts.forEach(oldAccount => {
    if (!isAlreadyInAccounts(oldAccount, newAccounts)) {
      newAccounts.push(oldAccount);
    }
  });
  return newAccounts;
}
