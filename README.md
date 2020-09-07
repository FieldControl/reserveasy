<div align="center">
  <h1>Reserveasy</h1>
  <p>

:money_with_wings: Never miss an ec2 or rds reservation again on Amazon Web Services and continue to save money :)

  </p>
  <p>

![Field Control ♥](https://img.shields.io/badge/Field%20Control-%20%20%20%20%20%20♥-blue.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/75b28e4216162b3f7612/maintainability)](https://codeclimate.com/github/FieldControl/reserveasy/maintainability)
![Continuous Integration](https://github.com/FieldControl/reserveasy/workflows/Continuous%20Integration/badge.svg?branch=master)

  </p>
  <small>
    Built with ❤ by 
      <a href="https://github.com/FieldControl">FieldControl</a> and
      <a href="https://github.com/FieldControl/reserveasy/graphs/contributors">contributors</a> - <a href="https://fieldcontrol.com.br/vaga-para-desenvolvedor.html?utm_source=github&utm_medium=opensource&utm_campaign=reserveasy">We are hiring</a>
  </small>
</div>

## Why

Because sometimes we forget ec2 or rds instances unreserved, and it cost us money :money_with_wings:

<div align="center">💙</div>

## Usage

1 - Clone reserveasy repository and install and link its dependencies:

```sh
git clone https://github.com/FieldControl/reserveasy.git
cd reserveasy
npm install
npm link
```

2 - Configure regions you would like to analyze at `config.json`:

```json
[
  { "region": "us-east-1" },
  { "region": "sa-east-1" }
]
```

3 - Run reserveasy:

```sh
reserveasy
```

4 - Watch the analysis result:

```js
{
  "us-east-1": { // <-- AWS region
    "ec2": {
      "instances": [ // <-- EC2 running instances for given region
        {
          "InstanceType": "t3.nano",
          "Platform": "linux",
          "instanceName": "instance-1"
        },
        {
          "InstanceType": "t2.medium",
          "Platform": "linux",
          "instanceName": "instance-2"
        }
      ],
      "reservations": [ // <-- EC2 active reservation instances for given region
        {
          "InstanceType": "t3.nano",
          "Platform": "linux"
        }
      ],
      "missingReservations": [ // <-- EC2 missing reservation instances for given region
        {                      // YOU SHOULD TAKE ACTION!
          "InstanceType": "t2.medium",
          "Platform": "linux",
          "instanceName": "instance-2"
        }
      ],
      "allocatedReservations": [ // <-- EC2 allocated reservation instances for given region
        {
          "InstanceType": "t3.nano",
          "Platform": "linux"
        }
      ],
      "unallocatedReservations": [] // <-- EC2 unallocated reservation instances for given region
    },                              // YOU SHOULD TAKE ACTION - useless reservation (・・;)ゞ
    "rds": {
      "instances": [ // <-- RDS running instances for given region
        {
          "DBInstanceIdentifier": "reserveasy-db",
          "DBInstanceClass": "db.t3.micro",
          "Engine": "postgres",
          "MultiAZ": false
        }
      ],
      "reservations": [ // <-- RDS active reservation instances for given region
        {
          "DBInstanceClass": "db.t3.micro",
          "Engine": "postgres",
          "MultiAZ": false
        }
      ],
      "missingReservations": [], // <-- RDS missing reservation instances for given region
                                 // YOU SHOULD TAKE ACTION! 
      "allocatedReservations": [ // <-- RDS allocated reservation instances for given region
        {
          "DBInstanceClass": "db.t3.micro",
          "Engine": "postgres",
          "MultiAZ": false
        }
      ],
      "unallocatedReservations": [] // <-- RDS unallocated reservation instances for given region
    }                               // YOU SHOULD TAKE ACTION - useless reservation (・・;)ゞ
  }
}
```

<div align="center">💙</div>

## Pull Requests

- **Add tests!** Your patch won't be accepted if it doesn't have tests.
- **Document any change in behaviour**. Make sure the README and any other
  relevant documentation are kept up-to-date.
- **Create topic branches**. Don't ask us to pull from your master branch.
- **One pull request per feature**. If you want to do more than one thing, send
  multiple pull requests.

<div align="center">💙</div>

## License

This project is licensed under the [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0) - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <br/>
  <br/>
  <br/>
  <br/>
</div>

<div align="center">
  <p>
    <sub>
      Open source, from <a href="https://instagram.com/fieldcontrolapp" target="_blank">Field Control</a> with ❤ - <a href="https://fieldcontrol.com.br/vaga-para-desenvolvedor.html?utm_source=github&utm_medium=opensource&utm_campaign=reserveasy">We are hiring!</a>
    </sub>
  </p> 
</div>