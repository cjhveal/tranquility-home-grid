# Tranquility Home Grid


Tranquility Home Grid is a netrunner-themed daily game that takes inspiration from games like Word Grid, GeoGrid, Flagdoku.

Think what gordian blade is to wordle, Tranquility Home Grid is for these.

The user is presented a 3x3 grid where each row and column represents a constraint like, install cost, faction, etc.

The 9 intersections of the grid each represent a pool of valid cards that can occupy that grid square.

The user must select a valid card for each of the grid squares, so that the card satisfies both constraints.

### Grid Design

**Problem:** many constraints will eliminate entire sides/types of cards, potentially making many intersections impossible.

**Solution:** We can split constraints into those intrinsically based on type, while others we can create larger unions to broaden their scope across types.

#### Broad Constraints:

**Cost**: can be abstracted to include any of: Rez cost, Install cost, Play cost, Advancement cost

**Faction**: can be loosened to always include one runner and one corp faction.

**Illustrator**: Certain illustrators likely have many cards across sides and types.

**Name Includes**: Could be simple words like "net", the number "2", or something like a color.

**Set**: Sets generally include cards from all types and factions

**Influence**: Every card type except IDs can cost influence, and even then 0 influence is a valid category.

**Starts with**: single letter may be overly restrictive, but a union of two letters will likely fit almost any set of constraints.


#### More Specific Constraints:
* Ice
    - Strength
    - Number of subs
    - Has on encounter effect
    - Has main subtype: Barrier, Code Gate, Sentry
    - Other subtypes: Tracer, AP, Harmonic

* Program
    - Install cost 
    - MU
* Etc, ...
