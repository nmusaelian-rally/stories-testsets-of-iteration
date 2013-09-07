Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    componentCls: 'app',
    scopeType: 'iteration',
    comboboxConfig: {
        fieldLabel: 'Select an Iteration:',
        labelWidth: 100,
        width: 300
    },
            
    addContent: function() {
        this._makeStore();
    },
    
    onScopeChange: function() {
        console.log('onScopeChange');
        this._makeStore();
    },
    
    _makeStore: function(){
        console.log('_makeStore');
         var storyStore = Ext.create('Rally.data.WsapiDataStore', {
            model: 'UserStory',
            fetch: ['FormattedID','Name'],
            pageSize: 100,
            autoLoad: true,
            filters: [this.getContext().getTimeboxScope().getQueryFilter()],
            listeners: {
                load: this._onStoriesLoaded,
                scope: this
            }
        }); 
    },
    
    _onStoriesLoaded: function(store, data){
                console.log('_onStoriesLoaded');
                var userStories = [];
                //console.log(data);
                Ext.Array.each(data, function(story) {
                    var s  = {
                        FormattedID: story.get('FormattedID'),
                        _ref: story.get("_ref"),  //required to make FormattedID clickable
                        Name: story.get('Name'),
                    };
                    userStories.push(s);
                 });
                
                this._createStoryGrid(userStories);
    },
   

     _createStoryGrid: function(stories) {
        console.log('_createStoryGrid');
        var that = this;
        //console.log(stories);
        var storyStore = Ext.create('Rally.data.custom.Store', {
                data: stories,
                pageSize: 100
            });
        if (!this.down('#storygrid')) {
        this.grid = this.add({
            xtype: 'rallygrid',
            itemId: 'storygrid',
            store: storyStore,
            columnCfgs: [
                {
                   text: 'Formatted ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Name', dataIndex: 'Name'
                }
            ],
            listeners: {
                render: this._makeAnotherStore,
                scope: this
            }
        });
         }else{
            that.grid.reconfigure(storyStore);
            this._makeAnotherStore(this);
         }
         
    },
        
    _makeAnotherStore: function(){
        console.log('_makeAnotherStore');
            Ext.create('Rally.data.WsapiDataStore', {
                model: 'TestSet',
                fetch: ['FormattedID', 'TestCases', 'TestCaseStatus'],  
                pageSize: 100,
                autoLoad: true,
                filters: [this.getContext().getTimeboxScope().getQueryFilter()],
                listeners: {
                    load: this._onTestSetsLoaded,
                    scope: this
                }
            }); 
    },
    
    _onTestSetsLoaded: function(store, data){
        console.log('_onTestSetsLoaded');
        var testSets = [];
         //console.log(data);
         Ext.Array.each(data, function(testset){ 
            var ts  = {
                FormattedID: testset.get('FormattedID'),
                _ref: testset.get('_ref'),  //required to make FormattedID clickable
                TestCaseStatus: testset.get('TestCaseStatus')
            };
            testSets.push(ts);
     });
     this._createTestSetGrid(testSets);
 },
 
     _createTestSetGrid: function(testsets) {
        console.log('_createTestSetGrid');
        //console.log(testsets);
        var testSetStore = Ext.create('Rally.data.custom.Store', {
                data: testsets,
                pageSize: 100,  
            });
        if (!this.down('#testsetgrid')) {
        this.grid2 = this.add({
            xtype: 'rallygrid',
            itemId: 'testsetgrid',
            store: testSetStore,
            //cls: 'testsetgrid',
            columnCfgs: [
                {
                   text: 'Formatted ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Test Case Status', dataIndex: 'TestCaseStatus'
                }
            ]
        });
         }else{
            this.grid2.reconfigure(testSetStore);
         }
    },

    
});