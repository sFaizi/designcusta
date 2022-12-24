var budgetController = (function () {
		var e = function (e, t, n) {
			(this.id = e),
				(this.description = t),
				(this.value = n),
				(this.percentage = -1);
		};
		(e.prototype.calcPercentage = function (e) {
			this.percentage = e > 0 ? Math.round((this.value / e) * 100) : -1;
		}),
			(e.prototype.getPercentage = function () {
				return this.percentage;
			});
		var t = function (e, t, n) {
				(this.id = e), (this.description = t), (this.value = n);
			},
			n = function (e) {
				var t = 0;
				i.allItems[e].forEach(function (e) {
					t += e.value;
				}),
					(i.totals[e] = t);
			},
			i = {
				allItems: { exp: [], inc: [] },
				totals: { exp: 0, inc: 0 },
				budget: 0,
				percentage: -1,
			};
		return {
			addItem: function (n, a, c) {
				var r, l;
				return (
					(l =
						i.allItems[n].length > 0
							? i.allItems[n][i.allItems[n].length - 1].id + 1
							: 0),
					'exp' === n
						? (r = new e(l, a, c))
						: 'inc' === n && (r = new t(l, a, c)),
					i.allItems[n].push(r),
					r
				);
			},
			deleteItem: function (e, t) {
				var n;
				-1 !==
					(n = i.allItems[e]
						.map(function (e) {
							return e.id;
						})
						.indexOf(t)) && i.allItems[e].splice(n, 1);
			},
			calculateBudget: function () {
				n('exp'),
					n('inc'),
					(i.budget = i.totals.inc - i.totals.exp),
					i.totals.inc > 0
						? (i.percentage = Math.round((i.totals.exp / i.totals.inc) * 100))
						: (i.percentage = -1);
			},
			calculatePercentages: function () {
				i.allItems.exp.forEach(function (e) {
					e.calcPercentage(i.totals.inc);
				});
			},
			getPercentages: function () {
				return i.allItems.exp.map(function (e) {
					return e.getPercentage();
				});
			},
			getBudget: function () {
				return {
					budget: i.budget,
					totalInc: i.totals.inc,
					totalExp: i.totals.exp,
					percentage: i.percentage,
				};
			},
			testing: function () {
				console.log(i);
			},
		};
	})(),
	UIController = (function () {
		var e = {
				inputType: '.add__type',
				inputDescription: '.add__description',
				inputValue: '.add__value',
				inputBtn: '.add__btn',
				incomeContainer: '.income__list',
				expensesContainer: '.expenses__list',
				budgetLabel: '.budget__value',
				incomeLabel: '.budget__income--value',
				expensesLabel: '.budget__expenses--value',
				percentageLabel: '.budget__expenses--percentage',
				container: '.container',
				expensesPercLabel: '.item__percentage',
				dateLabel: '.budget__title--month',
			},
			t = function (e, t) {
				var n, i;
				return (
					(i = (n = (e = (e = Math.abs(e)).toFixed(2)).split('.'))[0]).length >
						3 &&
						(i = i.substr(0, i.length - 3) + ',' + i.substr(i.length - 3, 3)),
					('exp' === t ? '-' : '+') + ' ' + i + '.' + n[1]
				);
			},
			n = function (e, t) {
				for (var n = 0; n < e.length; n++) t(e[n], n);
			};
		return {
			getInput: function () {
				return {
					type: document.querySelector(e.inputType).value,
					description: document.querySelector(e.inputDescription).value,
					value: parseFloat(document.querySelector(e.inputValue).value),
				};
			},
			addListItem: function (n, i) {
				var a, c, r;
				'inc' === i
					? ((r = e.incomeContainer),
					  (a =
							'<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'))
					: 'exp' === i &&
					  ((r = e.expensesContainer),
					  (a =
							'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>')),
					(c = (c = (c = a.replace('%id%', n.id)).replace(
						'%description%',
						n.description
					)).replace('%value%', t(n.value, i))),
					document.querySelector(r).insertAdjacentHTML('beforeend', c);
			},
			deleteListItem: function (e) {
				var t = document.getElementById(e);
				t.parentNode.removeChild(t);
			},
			clearFields: function () {
				var t, n;
				(t = document.querySelectorAll(
					e.inputDescription + ', ' + e.inputValue
				)),
					(n = Array.prototype.slice.call(t)).forEach(function (e, t, n) {
						e.value = '';
					}),
					n[0].focus();
			},
			displayBudget: function (n) {
				var i;
				(i = n.budget > 0 ? 'inc' : 'exp'),
					(document.querySelector(e.budgetLabel).textContent = t(n.budget, i)),
					(document.querySelector(e.incomeLabel).textContent = t(
						n.totalInc,
						'inc'
					)),
					(document.querySelector(e.expensesLabel).textContent = t(
						n.totalExp,
						'exp'
					)),
					n.percentage > 0
						? (document.querySelector(e.percentageLabel).textContent =
								n.percentage + '%')
						: (document.querySelector(e.percentageLabel).textContent = '---');
			},
			displayPercentages: function (t) {
				var i = document.querySelectorAll(e.expensesPercLabel);
				n(i, function (e, n) {
					t[n] > 0 ? (e.textContent = t[n] + '%') : (e.textContent = '---');
				});
			},
			displayMonth: function () {
				var t, n, i, a;
				(n = [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December',
				]),
					(i = (t = new Date()).getMonth()),
					(a = t.getFullYear()),
					(document.querySelector(e.dateLabel).textContent = n[i] + ' ' + a);
			},
			changedType: function () {
				var t = document.querySelectorAll(
					e.inputType + ',' + e.inputDescription + ',' + e.inputValue
				);
				n(t, function (e) {
					e.classList.toggle('red-focus');
				}),
					document.querySelector(e.inputBtn).classList.toggle('red');
			},
			getDOMstrings: function () {
				return e;
			},
		};
	})(),
	controller = (function (e, t) {
		var n = function () {
				e.calculateBudget();
				var n = e.getBudget();
				t.displayBudget(n);
			},
			i = function () {
				e.calculatePercentages();
				var n = e.getPercentages();
				t.displayPercentages(n);
			},
			a = function () {
				var a, c;
				'' !== (a = t.getInput()).description &&
					!isNaN(a.value) &&
					a.value > 0 &&
					((c = e.addItem(a.type, a.description, a.value)),
					t.addListItem(c, a.type),
					t.clearFields(),
					n(),
					i());
			},
			c = function (a) {
				var c, r, l, o;
				(c = a.target.parentNode.parentNode.parentNode.parentNode.id) &&
					((l = (r = c.split('-'))[0]),
					(o = parseInt(r[1])),
					e.deleteItem(l, o),
					t.deleteListItem(c),
					n(),
					i());
			};
		return {
			init: function () {
				var e;
				console.log('Application has started.'),
					t.displayMonth(),
					t.displayBudget({
						budget: 0,
						totalInc: 0,
						totalExp: 0,
						percentage: -1,
					}),
					(e = t.getDOMstrings()),
					document.querySelector(e.inputBtn).addEventListener('click', a),
					document.addEventListener('keypress', function (e) {
						(13 !== e.keyCode && 13 !== e.which) || a();
					}),
					document.querySelector(e.container).addEventListener('click', c),
					document
						.querySelector(e.inputType)
						.addEventListener('change', t.changedType);
			},
		};
	})(budgetController, UIController);
controller.init();
