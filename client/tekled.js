
Session.setDefault('questionNum', 0);
Session.setDefault('numOfCorrectAnswers', 0);
Session.setDefault('answered', false);
Session.setDefault('current', 'Alle');
Session.setDefault('explanation', '');

var exams = _.map(
  _.keys(exams_data), function(exam) {
    return {'title': exam};
  })
  .sort(function(a, b) {
    // sort on year, i.e 2014, 2013
    var year_a = parseInt(a.title.substr(0,4));
    var year_b = parseInt(b.title.substr(0,4));
    if (year_a > year_b) {
      return 1;
    }
    else if (year_a < year_b) {
      return -1;
    }
    // sort on time in year, i.e K, V, H
    return a.title.substr(5,1) > b.title.substr(5,1) ? -1 : 1;
  });

var questions = _.shuffle(_.flatten(_.values(exams_data)));

Template.sidebar.helpers({
  exams: function() {
    return exams.reverse();
  },
  isActive: function(title) {
    return title === Session.get('current') ? 'active' : '';
  }
});

Template.quiz.helpers({
  currentQuestion: function() {
    if(Session.get('questionNum') === -1)
      return [];
    return questions[Session.get('questionNum')];
  },
  points : function() {
    return Session.get('numOfCorrectAnswers') + " av " + (Session.get('questionNum') + 1) + " riktige.";
  },
  grade : function() {
    return "Karakter: " + calculateGrade(Session.get('numOfCorrectAnswers'), Session.get('questionNum') + 1);
  },
  progress : function() {
     return ((Session.get('questionNum')+1)*100/questions.length).toFixed(1) + "%";
  },
  exam : function() {
    return Session.get('current');
  },
  explanation : function() {
    return Session.get('explanation');
  },
  numberOfQuestions : function() {
    return questions.length;
  },
  questionNum : function() {
    return Session.get('questionNum') + 1;
  }
});

Template.quiz.events({
  'click .submit-answer' : function(e, tmpl) {
    var solution = questions[Session.get('questionNum')].solution;
    var chosen = e.currentTarget.id;
    e.currentTarget.blur();
    if (Session.get('answered')) {
      loadNextQuestion();
    }
    else {
        Session.set('explanation', questions[Session.get('questionNum')].explaination) ;
        Session.set('answered', true);
        if (chosen == solution) {
            Session.set('numOfCorrectAnswers', Session.get('numOfCorrectAnswers') + 1);
        }
        else {
            $('#' + chosen).addClass("btn-danger");
        }
        $('#' + solution).addClass("btn-success");       
    }
  },
  'click .btn-large' : function() {
    Session.set('questionNum', -1);
    clearQuestionLayout();
    Session.set('questionNum', 0);
    Session.set('numOfCorrectAnswers', 0);
    Session.set('answered', false);
    $('.hero-unit').remove("<h2>PHAIL.</h2> <p>Du strøyk. Skjerpings!</p>");
    $('.hero-unit').remove('<a href="" class="btn btn-primary btn-large">AGAIN!</a>');
    $('.hero-unit').remove("<h2>WIN.</h2> <p>Sånn. Du har stått, og kan nå lese de nyttige faga istedet.</p>");
  }
});

Template.sidebar.events({
  'click .change-exam' : function(e, tmpl) {
    e.preventDefault();
    Session.set('current', this.title);
    Session.set('questionNum', -1);
    if(this.title === undefined) {
      Session.set('current', 'Alle');
      questions = _.shuffle(_.flatten(_.values(exams_data)));
    }
    else {
      questions = _.flatten(_.pick(exams_data, Session.get('current')));
    }
    clearQuestionLayout()
    Session.set('questionNum', 0);
    Session.set('numOfCorrectAnswers', 0);
    Session.set('answered', false);
  }
});

function loadNextQuestion() {
  Session.set('answered', false);
  clearQuestionLayout();
  if (Session.get('questionNum') + 1 >= questions.length) {
    finished();
    return;
  }
  Session.set('questionNum', Session.get('questionNum') + 1);
    
}
function clearQuestionLayout() {
    $('.btn-danger').removeClass('btn-danger');
    $('.btn-success').removeClass('btn-success');
    Session.set('explanation', '');
}

function finished() {
    $('.hero-unit').html('<a href="" class="btn btn-primary btn-large">AGAIN!</a>');
    if (Session.get('numOfCorrectAnswers')/ Session.get('questionNum') < 0.4) {
        $('.hero-unit').prepend("<h2>PHAIL.</h2> <p>Du strøyk. Skjerpings!</p>");
        $('.btn-large').addClass('btn-danger');
    }
    else {
        $('.hero-unit').prepend("<h2>WIN.</h2> <p>Sånn. Du har stått, og kan nå lese de nyttige faga istedet.</p>");
        $('.btn-large').addClass('btn-success');
    }
    
}


function calculateGrade(correct, total) {
    var percent = 100*correct/total;
    var grade = "";
    if (percent >= 89)
        grade = "A";
    else if (percent >= 77)
        grade = "B";
    else if (percent >= 65)
        grade = "C";
    else if (percent >= 53)
        grade= "D";
    else if (percent >= 41)
        grade = "E";
    else
        grade = "F";
    return grade + " (" + percent.toFixed(1) + " %)";
}