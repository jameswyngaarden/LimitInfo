# Making Decisions with Limited Information: Learning about and under Ambiguity
This repository contains code related to our in prep project . All hypotheses and analysis plans were pre-registered on AsPredicted in fall semester 2019 and data collection commenced on shortly thereafter. Behavioral data will be shared via OSF when the manuscript is posted on bioRxiv.

## Notes
The current task is run using an online hosting platform Cognition.run which allows for javasctipt hosting and automatically works with the JsPsych Library (v 7.3 at the time of collection) see https://p0axcjyaey.cognition.run

In addition the data was cleaned, organized, and analyzed using a series of python notebooks.
While the libraries required are different for each notebook you generally need:
-os
-re
-json
-pandas
-numpy
-matplotlib
-seaborn
-scipy
-pymer4
-pingouin
-statsmodels.api

However, make sure that if a library is being imported in the first cell of the notebook you have a version of the library.

## Task
For the current project we plan to obtain participants through Prolific and collect data via Cognition.Run 

The JS task code and relevant files are included in the Task/ directory. Participants are given a Prolific ID which can be parsed from the html. This is done automatically by Cognition.Run At the end participants are given a unique link based on their Bonus amount to easily identify how much bonus money they should be given.

At any time data can be downloaded from the cognition.run website.

## Data
The bids data is data that has been organized from cognition.run to roughly conform to the BIDS standard of organization. This is done via the Make_bids notebook.
Raw data from Cognition.Run as well as other Demographic data provided by prolific are not included here until we determine the danger it poses to re-identification of participants.

## Analyses
There are 3 main hypotheses with different sub-hypotheses.
These are tested in 3 different notebooks Hypotheseis_1.ipynb, Hypothesis_2.ipynb, and Hypothesis_3.ipynb

