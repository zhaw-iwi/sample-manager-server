import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {User} from "../models/user";
import {Project} from "../models/project";
import {Question} from "../models/question";
import {Rule} from "../models/rule";
import {Answer} from "../models/answer";

@Injectable()
export class UserService {
  constructor() {
  }
  private _user:User;
  public getUser(id: string): User {
    if (this._user) { return this._user}

    let rule1:Rule = new Rule('rule-1', 8, 18, 2);
    let rule2:Rule = new Rule('rule-2', 10, 20, 1);
    let rules:Rule[] = [rule1, rule2];

    let answer1:Answer = new Answer('answer-1', '2016-03-20 13:21:23', 'nie', '47.399921, 8.621802', null, rule1);
    let answer2:Answer = new Answer('answer-2', '2016-03-20 09:54:25', 'nie', '47.399921, 8.621802', null, rule1);
    let answer3:Answer = new Answer('answer-3', '2016-03-20 11:25:21', 'Ja', '47.399921, 8.621802', null, rule2);
    let answer4:Answer = new Answer('answer-4', '2016-03-20 19:33:13', 'Nein', '47.399921, 8.621802', null, rule2);
    let answer5:Answer = new Answer('answer-5', '2016-03-22 12:25:21', '43.44', '47.399921, 8.621802', null, rule1);
    let answer6:Answer = new Answer('answer-6', '2016-03-22 17:33:13', '55.32', '47.399921, 8.621802', null, rule1);
    let answer7:Answer = new Answer('answer-7', '2016-03-22 13:32:13', '3km/h', '47.399921, 8.621802', null, rule1);
    let answer8:Answer = new Answer('answer-8', '2016-03-22 16:13:35', '32km/h', '47.399921, 8.621802', null, rule1);
    let answer9:Answer = new Answer('answer-9', '2016-03-20 13:21:23', 'nie', '47.399921, 8.621802', null, rule1);
    let answer10:Answer = new Answer('answer-10', '2016-03-20 09:54:25', 'nie', '47.399921, 8.621802', null, rule1);
    let answer11:Answer = new Answer('answer-11', '2016-03-20 11:25:21', 'Ja', '47.399921, 8.621802', null, rule2);
    let answer12:Answer = new Answer('answer-12', '2016-03-20 19:33:13', 'Nein', '47.399921, 8.621802', null, rule2);
    let answer13:Answer = new Answer('answer-13', '2016-03-22 12:25:21', '43.44', '47.399921, 8.621802', null, rule1);
    let answer14:Answer = new Answer('answer-14', '2016-03-22 17:33:13', '55.32', '47.399921, 8.621802', null, rule1);
    let answer15:Answer = new Answer('answer-15', '2016-03-22 13:32:13', '3km/h', '47.399921, 8.621802', null, rule1);
    let answer16:Answer = new Answer('answer-16', '2016-03-22 16:13:35', '32km/h', '47.399921, 8.621802', null, rule1);

    let question1:Question = new Question('question-1', 'Häufigkeit', 'Wie oft haben Sie heute schon geflucht?', ['nie', '< 5', '< 10', '> 10'], [answer1, answer2], null, rules);
    let question2:Question = new Question('question-2', 'Ja/Nein', 'Befinden Sie sich gerade in einer Gruppe?', ['Ja', 'Nein'], [answer3, answer4], null, rules);
    let question3:Question = new Question('question-3', 'Lautstärke', 'Geräuschbelastung am Mittag', ['0dB - 120dB'], [answer5, answer6], null, [rule1]);
    let question4:Question = new Question('question-4', 'Lokalisierung', 'Mobilität am Abend', ['0km/h - 100km/h'], [answer7, answer8], null, [rule1]);
    let question5:Question = new Question('question-5', 'Häufigkeit', 'Wie oft haben Sie heute schon geflucht?', ['nie', '< 5', '< 10', '> 10'], [answer9, answer10], null, rules);
    let question6:Question = new Question('question-6', 'Ja/Nein', 'Befinden Sie sich gerade in einer Gruppe?', ['Ja', 'Nein'], [answer11, answer12], null, rules);
    let question7:Question = new Question('question-7', 'Lautstärke', 'Geräuschbelastung am Mittag', ['0dB - 120dB'], [answer13, answer14], null, [rule1]);
    let question8:Question = new Question('question-8', 'Lokalisierung', 'Mobilität am Abend', ['0km/h - 100km/h'], [answer15, answer16], null, [rule1]);
    let questions:Question[] = [question1, question2, question3, question4, question5, question6, question7, question8];

    let project1:Project = new Project('project-1', 'Project Subject 1', '20. März 2016 16:32', questions, null, 'http://www.freebiewebresources.com/wp-content/uploads/2013/12/Twilight-Wallpaper-for-Free.jpg');
    let project2:Project = new Project('project-2', 'Project Subject 2', '19. März 2016 10:24', [], null, 'http://www.magazinehive.com/wp-content/uploads/2013/09/Beautiful-Sunset-Free-Download.jpg');
    let projects:Project[] = [project1, project2];

    question1.project = project1;
    question2.project = project1;
    question3.project = project1;
    question4.project = project1;

    let user:User = new User('user-1', 'user1', 'user1@mail.com', '', projects);
    answer1.user = user;
    answer2.user = user;
    answer3.user = user;
    answer4.user = user;

    project1.users = [user];
    project2.users = [user];

    this._user = user;
    return user;
  }

}
