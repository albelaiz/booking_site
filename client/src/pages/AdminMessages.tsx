import { useState } from 'react';
import { useMessages } from '../contexts/MessagesContext';
import AdminLayout from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Mail, MailOpen, Trash2, Reply, Calendar, User } from 'lucide-react';

const AdminMessages = () => {
  const { messages, updateMessageStatus, deleteMessage } = useMessages();
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const handleMarkAsRead = async (messageId: number) => {
    await updateMessageStatus(messageId, 'read');
  };

  const handleMarkAsReplied = async (messageId: number) => {
    await updateMessageStatus(messageId, 'replied');
  };

  const handleDelete = async (messageId: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(messageId);
      setSelectedMessage(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Mail className="w-4 h-4" />;
      case 'read': return <MailOpen className="w-4 h-4" />;
      case 'replied': return <Reply className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-gray-600">
              Manage contact form messages from website visitors
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({messages.length})
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'outline'}
            onClick={() => setFilter('new')}
            size="sm"
          >
            New ({messages.filter(m => m.status === 'new').length})
          </Button>
          <Button
            variant={filter === 'replied' ? 'default' : 'outline'}
            onClick={() => setFilter('replied')}
            size="sm"
          >
            Replied ({messages.filter(m => m.status === 'replied').length})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                    <p className="text-gray-600">
                      {filter === 'all' 
                        ? 'No messages have been received yet.' 
                        : `No ${filter} messages at the moment.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredMessages
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((message) => (
                  <Card 
                    key={message.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedMessage === message.id ? 'ring-2 ring-moroccan-blue' : ''
                    }`}
                    onClick={() => setSelectedMessage(message.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(message.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(message.status)}
                                <span className="capitalize">{message.status}</span>
                              </div>
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {message.subject}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            From: {message.name} ({message.email})
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>

          {/* Message Detail Panel */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              (() => {
                const message = messages.find(m => m.id === selectedMessage);
                if (!message) return null;

                return (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Message Details</span>
                        <Badge className={getStatusColor(message.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(message.status)}
                            <span className="capitalize">{message.status}</span>
                          </div>
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{message.subject}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{message.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{message.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Message</h5>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Actions</h5>
                        <div className="flex flex-col space-y-2">
                          {message.status === 'new' && (
                            <Button
                              onClick={() => handleMarkAsRead(message.id)}
                              variant="outline"
                              size="sm"
                            >
                              <MailOpen className="w-4 h-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                          {message.status !== 'replied' && (
                            <Button
                              onClick={() => handleMarkAsReplied(message.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Reply className="w-4 h-4 mr-2" />
                              Mark as Replied
                            </Button>
                          )}
                          <Button
                            onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                            variant="outline"
                            size="sm"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Reply via Email
                          </Button>
                          <Button
                            onClick={() => handleDelete(message.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Mail className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Select a message to view details
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
