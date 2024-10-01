import classes from './AboutPage.module.css';

const AboutPage = () => (
  <div className={classes.aboutPage}>
    <div className={classes.pageTitle}>
      <h1>About this site</h1>
    </div>

    <div className={classes.aboutPageContent}>
      <h2>Overview</h2>

      <p>
        This is a personal project I started to learn some new web dev
        techniques and to provide a hopefully useful resource to the Mechabellum
        community.
      </p>

      <p>
        The source code for this project is public on github at{' '}
        <a
          href="https://github.com/LukeSideris/mechabellum"
          rel="noopener noreferrer"
          target="_blank"
        >
          LukeSideris/mechabellum
        </a>
      </p>

      <h2>Upcoming features</h2>

      <p>
        I plan on keeping this project updated for the forseeable future with
        the latest patch changes and new units as they are released in-game.
      </p>

      <p>The next features on my roadmap are:</p>

      <ul>
        <li>Bugfixes and refinements to the combat calculator algorithms.</li>
        <li>Table view of mod effectiveness impact based on unit matchup.</li>
        <li>Data table views for combat statistics such as DPS/cost.</li>
        <li>Calculator support for most unit upgrade techs.</li>
      </ul>

      <h2>Bug reporting and feedback</h2>

      <p>Questions? Comments? Bugs?</p>
      <ul>
        <li>
          <a
            href="https://www.reddit.com/message/compose?to=boatpile&subject=Mechabellum%20CC%20feedback&message="
            rel="noopener noreferrer"
            target="_blank"
          >
            Message me on Reddit
          </a>
        </li>
        <li>
          <a
            href="https://github.com/LukeSideris/mechabellum/issues/new"
            rel="noopener noreferrer"
            target="_blank"
          >
            File an issue on Github
          </a>
        </li>
        <li>Tag me @boatpile on the Mechabellum Discord server</li>
      </ul>

      <h2>About the math</h2>

      <p>
        All of the values presented for time to kill and effectiveness should be
        taken as estimates. In-game combat is randomized with units having
        fluctuations in attack speed and accuracy so the actual results will not
        be the same across multiple combats.
      </p>
      <p>
        In general, my combat analysis assumes optimal engagement and targeting.
        For example, sledgehammers can waste shots by targeting the same crawler
        but my algorithm always has them targeting different targets.
      </p>
      <p>
        We also do not account for units like crawlers clumping together or splitting as they move.
      </p>
      <p>
        Some units are not represented well in this calculator. For example,
        hackers do not account for taking over units. Stormcallers do not miss
        fast targets, etc. I may address some of these issues in the future.
      </p>
      <p>
        Some units have an additional cooldown time in-between killing units.
        For example, melting point takes a long time to acquire a new target.
        There are no stats for this in-game so the targeting cooldown is not
        accounted for.
      </p>

      <h3>Effectiveness calculation</h3>

      <p>Here is how the effectiveness algorithm works:</p>

      <ol>
        <li>
          Calculate the time required for the attacker to completely wipe out
          the defender: <code>timeA</code>
        </li>
        <li>
          Get the time required for defender to kill the attacker:{' '}
          <code>timeB</code>
        </li>
        <li>
          If one unit outranges the other, add additional time as needed for
          closing the distance
        </li>
        <li>
          Effectiveness formula is:{' '}
          <code>(timeB / timeA) / (costA / costB)</code>
        </li>
        <li>
          Account somewhat for attrition - reduced firepower as units in the
          squad are killed
        </li>
      </ol>

      <p>
        Note that effectiveness relies a lot on unit cost, which is why you may
        see reduced effectiveness when leveling up units in some matchups.
      </p>

      <h3>Notes on specific units</h3>

      <p>
        <b>Melting point</b> has a strange damage ramp forumla. If anyone knows
        the exact math behind it please let me know.
      </p>

      <p>
        <b>Stormcaller</b> stats are not totally reliable at this point due to
        their unpredictability in game
      </p>

      <p>
        <b>Sandworm</b> burrow is not currently accounted for in the calculator.
      </p>

      <p>
        <b>War factory</b> has 4 cannons that shoot independently, but can only
        target units at certain angles. Most of the time only 2 cannons can
        shoot so I am using 2 cannons for my calculator
      </p>

      <p></p>
    </div>
  </div>
);

export default AboutPage;
