# Fragments
This directory expects a collection of directories, each named for the app in which the fragments will be used. Any jointly useful fragments can sit at this level, or under a `utils` directory if they become too numerous.

## Classes
The decision has been made to keep these interactor files as classes with static fields and methods. This is to ensure that in a given cypress test, all actions will be declared alongside the interactor on which they are defined, helping onboarding and lowering the chance of clashing names such as `waitLoading` creating issues in a given test where more than one interactor is used.

It also ensures that ALL fields and methods declared as part of the interactor are available then to all tests, which will should hopefully serve to both make devs consider carefully the boundaries of each method/field, as well as reducing the need to duplicate individual logic outside of the interactor in several tests.

Thhe hope is that this leads to cleaner code and more consistently written tests.