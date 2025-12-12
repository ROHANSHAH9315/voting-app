voting appplication
what???
A functionality where user can give vote to given set of candidates


models?
Routes?

voting app functionality

1. user sign in / sign up
2. see the list of candidates
3. vote one of the candidate, after voting , user can't voote again
4. there is a route which shows the list of candidates and their live vote counts sorted by threir vote count 
5. user data must contain their one unique government id proof named: adhar chad number
6. there should be one admin who can maintain the table of candidate and he can't abele to vote at all 
7. user can change their password
8. user can login only with adhar card number and password
9. admin can't vote at all


===================================================================

Routes

user Authentication:
    /signup: post - createa new user account.
    /login: post - log in to an existing account . [ adhar card number + password ]

voting:
    /candidates: Get - Get the list of candidates.
    /vote/:candidateId: post - vote for a specific candidate.

vote counts:
    /vote/counts: Get - get the list of candidate sorted by their vote counts.

user porfile:
    /profiles: get = get the user's profile information.
    /profile/password: put - change the user's password.

Admin candidate Management:
    /candidates: post - create a new candidate.
    /candidates/:candidateId: put - update an existing candidate.
    /candidates/:candidateId: delete - delete a candidate from their list.